import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  LinearProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Chat as ChatIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { socketService } from '../services/socketService';
import PollResults from './PollResults';
import ChatPopup from './ChatPopup';

const StudentDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { student, currentPoll, timeRemaining, error, polls } = useSelector((state: RootState) => state.app);
  
  // Debug: Log what polls the student is seeing
  console.log('Student seeing polls:', polls);
  console.log('Student seeing currentPoll:', currentPoll);
  
  const [name, setName] = useState('');
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    // Check if student name is already set
    if (!student) {
      setNameDialogOpen(true);
    } else {
      setHasAnswered(student.hasAnswered);
      setNameDialogOpen(false);
      setIsJoining(false);
    }
  }, [student]);

  useEffect(() => {
    // Update hasAnswered when student data changes
    if (student) {
      setHasAnswered(student.hasAnswered);
    }
  }, [student]);

  const handleNameSubmit = () => {
    if (!name.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Name is required' });
      return;
    }
    
    console.log('Submitting student name:', name.trim());
    setIsJoining(true);
    socketService.joinAsStudent(name.trim());
    // Don't close dialog immediately - wait for server response
  };

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) {
      dispatch({ type: 'SET_ERROR', payload: 'Please select an answer' });
      return;
    }

    socketService.submitAnswer({ optionId: selectedAnswer });
    setHasAnswered(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressValue = () => {
    if (!currentPoll) return 0;
    const totalTime = currentPoll.timeLimit / 1000; // Convert to seconds
    return ((totalTime - timeRemaining) / totalTime) * 100;
  };

  if (!student) {
    return (
      <Dialog open={nameDialogOpen} onClose={() => {}} maxWidth="sm" fullWidth>
        <DialogTitle>Enter Your Name</DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            Please enter your name to join the polling session. This name will be visible to the teacher.
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Your Name"
            fullWidth
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleNameSubmit()}
          />
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleNameSubmit} 
            variant="contained"
            disabled={isJoining}
          >
            {isJoining ? 'Joining...' : 'Join Session'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Student Dashboard - {student.name}
          </Typography>
          <Button
            color="inherit"
            startIcon={<ChatIcon />}
            onClick={() => setChatOpen(true)}
          >
            Chat
          </Button>
          <Button
            color="inherit"
            onClick={() => {
              localStorage.removeItem('userType');
              // Clear Redux state
              dispatch({ type: 'CLEAR_ALL_DATA' });
              window.location.reload();
            }}
          >
            Switch Role
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {currentPoll ? (
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">
                  Current Poll
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <TimerIcon />
                  <Typography variant="body2">
                    {formatTime(timeRemaining)}
                  </Typography>
                </Box>
              </Box>

              {/* Timer Progress Bar */}
              <LinearProgress
                variant="determinate"
                value={getProgressValue()}
                sx={{ mb: 3, height: 8, borderRadius: 4 }}
              />

              <Typography variant="h5" gutterBottom>
                {currentPoll.question}
              </Typography>

              {hasAnswered ? (
                <Box textAlign="center" py={4}>
                  <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" color="success.main" gutterBottom>
                    Answer Submitted!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    You can view the results below. The poll will end when time runs out or all students have answered.
                  </Typography>
                </Box>
              ) : (
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">Select your answer:</FormLabel>
                  <RadioGroup
                    value={selectedAnswer}
                    onChange={(e) => setSelectedAnswer(e.target.value)}
                  >
                    {currentPoll.options.map((option) => (
                      <FormControlLabel
                        key={option.id}
                        value={option.id}
                        control={<Radio />}
                        label={option.text}
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </RadioGroup>
                  <Button
                    variant="contained"
                    onClick={handleAnswerSubmit}
                    disabled={!selectedAnswer || timeRemaining === 0}
                    sx={{ mt: 2 }}
                  >
                    Submit Answer
                  </Button>
                </FormControl>
              )}

              {/* Show results after answering or when time is up */}
              {(hasAnswered || timeRemaining === 0) && (
                <Box mt={4}>
                  <Typography variant="h6" gutterBottom>
                    Live Results:
                  </Typography>
                  <PollResults 
                    poll={currentPoll} 
                    timeRemaining={timeRemaining} 
                    isTeacher={false}
                    studentAnswer={student?.currentAnswer || undefined}
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent>
              <Box textAlign="center" py={4}>
                <Typography variant="h6" gutterBottom>
                  No Active Poll
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Waiting for the teacher to create a poll. You'll be notified when a new poll is available.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Student Status */}
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Status
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip
                label={`Name: ${student.name}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={hasAnswered ? 'Answered' : 'Waiting to Answer'}
                color={hasAnswered ? 'success' : 'default'}
                variant="outlined"
              />
              {currentPoll && (
                <Chip
                  label={`Time Remaining: ${formatTime(timeRemaining)}`}
                  color={timeRemaining < 10 ? 'error' : 'default'}
                  variant="outlined"
                />
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Chat Popup */}
      <ChatPopup open={chatOpen} onClose={() => setChatOpen(false)} />

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => dispatch({ type: 'CLEAR_ERROR' })}
      >
        <Alert severity="error" onClose={() => dispatch({ type: 'CLEAR_ERROR' })}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StudentDashboard;
