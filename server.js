const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      process.env.CLIENT_URL,
      "https://your-app-name.netlify.app" // Replace with your actual Netlify URL
    ].filter(Boolean),
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: [
    "http://localhost:3000",
    process.env.CLIENT_URL,
    "https://your-app-name.netlify.app" // Replace with your actual Netlify URL
  ].filter(Boolean),
  credentials: true
}));
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'client/build')));

// In-memory storage (in production, use a database)
let polls = new Map();
let students = new Map();
let currentPoll = null;
let pollTimer = null;

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle teacher connection
  socket.on('teacher-join', () => {
    socket.join('teachers');
    socket.emit('teacher-connected', {
      currentPoll,
      students: Array.from(students.values()),
      polls: Array.from(polls.values())
    });
    console.log('Teacher connected:', socket.id);
  });

  // Handle student connection
  socket.on('student-join', (data) => {
    const { name } = data;
    if (!name || name.trim() === '') {
      socket.emit('error', { message: 'Name is required' });
      return;
    }

    // Check if name already exists
    const existingStudent = Array.from(students.values()).find(s => s.name === name);
    if (existingStudent) {
      socket.emit('error', { message: 'Name already taken. Please choose a different name.' });
      return;
    }

    const student = {
      id: socket.id,
      name: name.trim(),
      hasAnswered: false,
      currentAnswer: null,
      joinedAt: new Date()
    };

    students.set(socket.id, student);
    socket.join('students');
    
    socket.emit('student-connected', {
      student,
      currentPoll,
      timeRemaining: currentPoll ? getTimeRemaining() : 0
    });

    // Notify teachers about new student
    io.to('teachers').emit('student-joined', student);
    // Also send updated students list to teachers
    io.to('teachers').emit('students-updated', Array.from(students.values()));
    console.log('Student connected:', name, socket.id);
  });

  // Handle poll creation
  socket.on('create-poll', (data) => {
    if (socket.rooms.has('teachers')) {
      const { question, options, timeLimit = 60 } = data;
      
      // Check if we can create a new poll
      if (currentPoll && !canCreateNewPoll()) {
        socket.emit('error', { 
          message: 'Cannot create new poll. Previous poll is still active or not all students have answered.' 
        });
        return;
      }

      // Clear previous poll timer
      if (pollTimer) {
        clearTimeout(pollTimer);
      }

      const pollOptions = options.map(option => ({
        id: uuidv4(),
        text: option,
        votes: 0,
        voters: []
      }));
      
      const poll = {
        id: uuidv4(),
        question,
        options: pollOptions,
        correctAnswerId: correctAnswerIndex !== null && correctAnswerIndex !== undefined ? 
          pollOptions[correctAnswerIndex]?.id : null,
        timeLimit: timeLimit * 1000, // Convert to milliseconds
        createdAt: new Date(),
        status: 'active'
      };

      currentPoll = poll;
      polls.set(poll.id, poll);

      // Reset all students' answer status for new poll
      students.forEach(student => {
        student.hasAnswered = false;
        student.currentAnswer = null;
      });

      // Start timer
      pollTimer = setTimeout(() => {
        endPoll();
      }, poll.timeLimit);

      // Broadcast poll to all clients
      io.emit('poll-created', {
        poll,
        timeRemaining: poll.timeLimit
      });

      console.log('Poll created:', poll.question);
    }
  });

  // Handle student answer submission
  socket.on('submit-answer', (data) => {
    if (socket.rooms.has('students') && currentPoll && currentPoll.status === 'active') {
      const student = students.get(socket.id);
      if (!student || student.hasAnswered) {
        socket.emit('error', { message: 'You have already answered this question.' });
        return;
      }

      const { optionId } = data;
      const option = currentPoll.options.find(opt => opt.id === optionId);
      
      if (!option) {
        socket.emit('error', { message: 'Invalid option selected.' });
        return;
      }

      // Update student's answer
      student.hasAnswered = true;
      student.currentAnswer = optionId;

      // Update poll results
      option.votes++;
      option.voters.push(student.id);

      // Notify all clients about updated results
      io.emit('poll-results-updated', {
        poll: currentPoll,
        timeRemaining: getTimeRemaining()
      });

      // Notify teachers about student answer
      io.to('teachers').emit('student-answered', {
        student: student.name,
        answer: option.text
      });

      console.log(`Student ${student.name} answered: ${option.text}`);
    }
  });

  // Handle chat messages
  socket.on('send-message', (data) => {
    const { message, senderName, senderType } = data;
    const chatMessage = {
      id: uuidv4(),
      message,
      senderName,
      senderType,
      timestamp: new Date()
    };

    io.emit('new-message', chatMessage);
  });

  // Handle setting correct answer (teacher only)
  socket.on('set-correct-answer', (data) => {
    console.log('Received set-correct-answer:', data);
    console.log('Socket rooms:', Array.from(socket.rooms));
    console.log('Current poll exists:', !!currentPoll);
    
    if (socket.rooms.has('teachers') && currentPoll) {
      const { optionId } = data;
      const option = currentPoll.options.find(opt => opt.id === optionId);
      
      if (option) {
        currentPoll.correctAnswerId = optionId;
        
        // Broadcast updated poll to all clients
        io.emit('poll-results-updated', {
          poll: currentPoll,
          timeRemaining: getTimeRemaining()
        });
        
        console.log(`Correct answer set to: ${option.text}`);
      } else {
        console.log('Option not found:', optionId);
      }
    } else {
      console.log('Not a teacher or no current poll');
    }
  });

  // Handle student removal (teacher only)
  socket.on('remove-student', (data) => {
    if (socket.rooms.has('teachers')) {
      const { studentId } = data;
      const student = students.get(studentId);
      
      if (student) {
        students.delete(studentId);
        io.to(studentId).emit('removed-by-teacher');
        io.to(studentId).disconnectSockets();
        
        // Notify other teachers
        io.to('teachers').emit('student-removed', student);
        console.log(`Student ${student.name} removed by teacher`);
      }
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const student = students.get(socket.id);
    if (student) {
      students.delete(socket.id);
      io.to('teachers').emit('student-left', student);
      console.log('Student disconnected:', student.name);
    } else {
      console.log('Teacher disconnected:', socket.id);
    }
  });
});

// Helper functions
function canCreateNewPoll() {
  if (!currentPoll) return true;
  
  // Check if all students have answered
  const allStudentsAnswered = Array.from(students.values()).every(student => student.hasAnswered);
  return allStudentsAnswered;
}

function getTimeRemaining() {
  if (!currentPoll) return 0;
  
  const elapsed = Date.now() - currentPoll.createdAt.getTime();
  const remaining = Math.max(0, currentPoll.timeLimit - elapsed);
  return Math.ceil(remaining / 1000); // Return in seconds
}

function endPoll() {
  if (currentPoll) {
    currentPoll.status = 'ended';
    currentPoll.endedAt = new Date();
    
    io.emit('poll-ended', {
      poll: currentPoll,
      results: currentPoll.options.map(option => ({
        id: option.id,
        text: option.text,
        votes: option.votes,
        percentage: students.size > 0 ? Math.round((option.votes / students.size) * 100) : 0
      }))
    });

    console.log('Poll ended:', currentPoll.question);
  }
}

// API Routes
app.get('/api/polls', (req, res) => {
  res.json(Array.from(polls.values()));
});

app.get('/api/students', (req, res) => {
  res.json(Array.from(students.values()));
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
