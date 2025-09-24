import { io, Socket } from 'socket.io-client';
import { store } from '../store';
import { 
  setConnectionStatus, 
  setStudent,
  setCurrentPoll, 
  setStudents, 
  setPolls, 
  setTimeRemaining,
  addChatMessage,
  updatePollResults,
  studentJoined,
  studentLeft,
  studentAnswered,
  studentRemoved,
  setError,
  clearError
} from '../store';
import { CreatePollData, SubmitAnswerData, Student, ChatMessage } from '../types';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(): void {
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
    
    this.socket = io(serverUrl, {
      transports: ['polling', 'websocket'],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupEventListeners();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Connected to server');
      store.dispatch(setConnectionStatus(true));
      store.dispatch(clearError());
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
      store.dispatch(setConnectionStatus(false));
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      store.dispatch(setError('Connection failed. Please check your internet connection.'));
      this.handleReconnect();
    });

    this.socket.on('error', (data) => {
      console.error('Socket error:', data);
      store.dispatch(setError(data.message || 'An error occurred'));
    });

    // Teacher events
    this.socket.on('teacher-connected', (data) => {
      console.log('Teacher connected:', data);
      store.dispatch(setCurrentPoll(data.currentPoll));
      store.dispatch(setStudents(data.students));
      store.dispatch(setPolls(data.polls));
    });

    // Student events
    this.socket.on('student-connected', (data) => {
      console.log('Student connected:', data);
      store.dispatch(setStudent(data.student));
      store.dispatch(setCurrentPoll(data.currentPoll));
      store.dispatch(setTimeRemaining(data.timeRemaining));
    });

    // Poll events
    this.socket.on('poll-created', (data) => {
      console.log('Poll created:', data);
      store.dispatch(setCurrentPoll(data.poll));
      store.dispatch(setTimeRemaining(data.timeRemaining));
      this.startPollTimer(data.timeRemaining);
    });

    this.socket.on('poll-results-updated', (data) => {
      console.log('Poll results updated:', data);
      store.dispatch(updatePollResults(data.poll));
      store.dispatch(setTimeRemaining(data.timeRemaining));
    });

    this.socket.on('poll-ended', (data) => {
      console.log('Poll ended:', data);
      store.dispatch(setTimeRemaining(0));
      // Poll results are already updated via poll-results-updated
    });

    // Student management events
    this.socket.on('student-joined', (student: Student) => {
      console.log('Student joined:', student);
      store.dispatch(studentJoined(student));
    });

    this.socket.on('students-updated', (students: Student[]) => {
      console.log('Students updated:', students);
      store.dispatch(setStudents(students));
    });

    this.socket.on('student-left', (student: Student) => {
      console.log('Student left:', student);
      store.dispatch(studentLeft(student));
    });

    this.socket.on('student-answered', (data: { student: string; answer: string }) => {
      console.log('Student answered:', data);
      store.dispatch(studentAnswered(data));
    });

    this.socket.on('student-removed', (student: Student) => {
      console.log('Student removed:', student);
      store.dispatch(studentRemoved(student));
    });

    // Chat events
    this.socket.on('new-message', (message: ChatMessage) => {
      console.log('New chat message:', message);
      store.dispatch(addChatMessage(message));
    });

    // Student removal event
    this.socket.on('removed-by-teacher', () => {
      console.log('Removed by teacher');
      store.dispatch(setError('You have been removed by the teacher.'));
      // Redirect to home or show appropriate message
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      setTimeout(() => {
        console.log(`Reconnection attempt ${this.reconnectAttempts}`);
        this.connect();
      }, delay);
    } else {
      store.dispatch(setError('Unable to connect to server. Please refresh the page.'));
    }
  }

  private startPollTimer(timeRemaining: number): void {
    const timer = setInterval(() => {
      const currentTime = store.getState().app.timeRemaining;
      if (currentTime > 0) {
        store.dispatch(setTimeRemaining(currentTime - 1));
      } else {
        clearInterval(timer);
      }
    }, 1000);
  }

  // Teacher methods
  joinAsTeacher(): void {
    if (this.socket) {
      this.socket.emit('teacher-join');
    }
  }

  createPoll(data: CreatePollData): void {
    if (this.socket) {
      this.socket.emit('create-poll', data);
    }
  }

  setCorrectAnswer(optionId: string): void {
    if (this.socket) {
      this.socket.emit('set-correct-answer', { optionId });
    }
  }

  removeStudent(studentId: string): void {
    if (this.socket) {
      this.socket.emit('remove-student', { studentId });
    }
  }

  // Student methods
  joinAsStudent(name: string): void {
    if (this.socket) {
      this.socket.emit('student-join', { name });
    }
  }

  submitAnswer(data: SubmitAnswerData): void {
    if (this.socket) {
      this.socket.emit('submit-answer', data);
    }
  }

  // Chat methods
  sendMessage(message: string, senderName: string, senderType: 'teacher' | 'student'): void {
    if (this.socket) {
      this.socket.emit('send-message', {
        message,
        senderName,
        senderType
      });
    }
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const socketService = new SocketService();
