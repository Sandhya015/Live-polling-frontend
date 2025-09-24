import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fab,
  Snackbar,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Chat as ChatIcon,
  Timer as TimerIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { socketService } from '../services/socketService';
import { CreatePollData } from '../types';
import PollResults from './PollResults';
import ChatPopup from './ChatPopup';

const TeacherDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { students, currentPoll, timeRemaining, error, polls } = useSelector((state: RootState) => state.app);
  
  const [createPollOpen, setCreatePollOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [pollData, setPollData] = useState<CreatePollData>({
    question: '',
    options: ['', ''],
    timeLimit: 60
  });
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null);

  const handleCreatePoll = () => {
    if (!pollData.question.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Question is required' });
      return;
    }

    const validOptions = pollData.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      dispatch({ type: 'SET_ERROR', payload: 'At least 2 options are required' });
      return;
    }

    console.log('Creating poll:', {
      ...pollData,
      options: validOptions,
      correctAnswerIndex
    });

    socketService.createPoll({
      ...pollData,
      options: validOptions,
      correctAnswerIndex
    });

    setCreatePollOpen(false);
    setPollData({
      question: '',
      options: ['', ''],
      timeLimit: 60
    });
    setCorrectAnswerIndex(null);
  };

  const handleRemoveStudent = (studentId: string) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      socketService.removeStudent(studentId);
    }
  };

  const addOption = () => {
    setPollData(prev => ({
      ...prev,
      options: [...prev.options, '']
    }));
  };

  const updateOption = (index: number, value: string) => {
    setPollData(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const removeOption = (index: number) => {
    if (pollData.options.length > 2) {
      setPollData(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Teacher Dashboard
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

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {/* Students List */}
          <Box sx={{ flex: '1 1 300px', minWidth: '300px' }}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Students ({students.length})
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Answered: {students.filter(s => s.hasAnswered).length} / {students.length}
                </Typography>
                <List>
                  {students.map((student) => (
                    <ListItem key={student.id} divider>
                      <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <ListItemText
                        primary={student.name}
                        secondary={
                          <Box>
                            <Chip
                              size="small"
                              label={student.hasAnswered ? 'Answered' : 'Waiting'}
                              color={student.hasAnswered ? 'success' : 'default'}
                              sx={{ mr: 1 }}
                            />
                            {student.hasAnswered && currentPoll && (
                              <Chip
                                size="small"
                                label={
                                  currentPoll.options.find(opt => opt.id === student.currentAnswer)?.text || 
                                  `Option ${student.currentAnswer}`
                                }
                                color="primary"
                              />
                            )}
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => handleRemoveStudent(student.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>

          {/* Poll Management */}
          <Box sx={{ flex: '2 1 400px', minWidth: '400px' }}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    {currentPoll ? 'Current Poll' : 'Poll Management'}
                  </Typography>
                  {currentPoll && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <TimerIcon />
                      <Typography variant="body2">
                        Time Remaining: {formatTime(timeRemaining)}
                      </Typography>
                    </Box>
                  )}
                </Box>

                {currentPoll ? (
                  <PollResults poll={currentPoll} timeRemaining={timeRemaining} isTeacher={true} />
                ) : (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      No active poll. Create a new poll to get started.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setCreatePollOpen(true)}
                    >
                      Create New Poll
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Past Polls Section */}
            {polls.length > 0 && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Past Polls ({polls.length})
                  </Typography>
                  <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {polls.slice().reverse().map((poll) => (
                      <Box key={poll.id} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {poll.question}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {poll.status === 'ended' ? 'Ended' : 'Active'} • 
                          {new Date(poll.createdAt).toLocaleString()}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {poll.options.map((option) => (
                            <Chip
                              key={option.id}
                              label={`${option.text} (${option.votes})`}
                              size="small"
                              color={poll.correctAnswerId === option.id ? 'success' : 'default'}
                              variant={poll.correctAnswerId === option.id ? 'filled' : 'outlined'}
                              icon={poll.correctAnswerId === option.id ? <CheckCircleIcon /> : undefined}
                            />
                          ))}
                        </Box>
                        {poll.correctAnswerId && (
                          <Typography variant="caption" color="success.main" sx={{ mt: 1, display: 'block' }}>
                            ✓ Correct Answer: {poll.options.find(opt => opt.id === poll.correctAnswerId)?.text}
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>

        {/* Floating Action Button */}
        <Fab
          color="primary"
          aria-label="create poll"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
          onClick={() => setCreatePollOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Container>

      {/* Create Poll Dialog */}
      <Dialog open={createPollOpen} onClose={() => setCreatePollOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Poll</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Question"
            fullWidth
            variant="outlined"
            value={pollData.question}
            onChange={(e) => setPollData(prev => ({ ...prev, question: e.target.value }))}
            sx={{ mb: 2 }}
          />
          
          <Typography variant="subtitle1" gutterBottom>
            Options:
          </Typography>
          
          {pollData.options.map((option, index) => (
            <Box key={index} display="flex" gap={1} mb={1} alignItems="center">
              <TextField
                fullWidth
                label={`Option ${index + 1}`}
                value={option}
                onChange={(e) => updateOption(index, e.target.value)}
              />
              <Button
                variant={correctAnswerIndex === index ? "contained" : "outlined"}
                color={correctAnswerIndex === index ? "success" : "primary"}
                size="small"
                onClick={() => setCorrectAnswerIndex(correctAnswerIndex === index ? null : index)}
                disabled={!option.trim()}
              >
                {correctAnswerIndex === index ? "Correct" : "Mark Correct"}
              </Button>
              {pollData.options.length > 2 && (
                <IconButton onClick={() => removeOption(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}
          
          <Button onClick={addOption} startIcon={<AddIcon />} sx={{ mt: 1 }}>
            Add Option
          </Button>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Time Limit (seconds)</InputLabel>
            <Select
              value={pollData.timeLimit}
              onChange={(e) => setPollData(prev => ({ ...prev, timeLimit: e.target.value as number }))}
            >
              <MenuItem value={30}>30 seconds</MenuItem>
              <MenuItem value={60}>60 seconds</MenuItem>
              <MenuItem value={90}>90 seconds</MenuItem>
              <MenuItem value={120}>120 seconds</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreatePollOpen(false)}>Cancel</Button>
          <Button onClick={handleCreatePoll} variant="contained">
            Create Poll
          </Button>
        </DialogActions>
      </Dialog>

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

export default TeacherDashboard;
