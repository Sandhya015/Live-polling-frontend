import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Paper,
  Avatar
} from '@mui/material';
import {
  School as TeacherIcon,
  Person as StudentIcon
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setUserType } from '../store';
import { socketService } from '../services/socketService';

const RoleSelection: React.FC = () => {
  const dispatch = useDispatch();

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    dispatch(setUserType(role));
    localStorage.setItem('userType', role);
    
    // Join the appropriate room
    if (role === 'teacher') {
      socketService.joinAsTeacher();
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          Live Polling System
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Choose your role to get started
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>
        <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
          <Card 
            sx={{ 
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
            onClick={() => handleRoleSelect('teacher')}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'primary.main',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <TeacherIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" component="h2" gutterBottom>
                Teacher
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Create polls, view live results, and manage your classroom
              </Typography>
              <Button
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => handleRoleSelect('teacher')}
              >
                Join as Teacher
              </Button>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: '1 1 300px', maxWidth: '400px' }}>
          <Card 
            sx={{ 
              height: '100%',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
            onClick={() => handleRoleSelect('student')}
          >
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: 'secondary.main',
                  mx: 'auto',
                  mb: 2
                }}
              >
                <StudentIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Typography variant="h5" component="h2" gutterBottom>
                Student
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Answer polls, view results, and participate in real-time
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => handleRoleSelect('student')}
              >
                Join as Student
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Paper sx={{ mt: 4, p: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Features:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: '1 1 300px' }}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Teacher Features:
            </Typography>
            <ul>
              <li>Create and manage polls</li>
              <li>View live polling results</li>
              <li>Real-time student monitoring</li>
              <li>Chat with students</li>
              <li>Remove students if needed</li>
            </ul>
          </Box>
          <Box sx={{ flex: '1 1 300px' }}>
            <Typography variant="subtitle2" color="secondary" gutterBottom>
              Student Features:
            </Typography>
            <ul>
              <li>Enter unique name on first visit</li>
              <li>Answer poll questions</li>
              <li>View live results</li>
              <li>60-second time limit per question</li>
              <li>Chat with teacher and classmates</li>
            </ul>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default RoleSelection;
