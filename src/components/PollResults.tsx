import React from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  Chip,
  Button
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { Poll } from '../types';
import { socketService } from '../services/socketService';

interface PollResultsProps {
  poll: Poll;
  timeRemaining: number;
  isTeacher?: boolean;
  studentAnswer?: string;
}

const PollResults: React.FC<PollResultsProps> = ({ poll, timeRemaining, isTeacher = false, studentAnswer }) => {
  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
  const maxVotes = Math.max(...poll.options.map(option => option.votes));

  const getPercentage = (votes: number) => {
    return totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
  };

  const getBarColor = (votes: number, optionId: string): "primary" | "secondary" | "success" | "error" | "info" | "warning" | undefined => {
    if (poll.correctAnswerId === optionId) {
      return 'success';
    }
    if (votes === maxVotes && votes > 0) {
      return 'primary';
    }
    return 'secondary';
  };

  const isCorrectAnswer = (optionId: string) => {
    return poll.correctAnswerId === optionId;
  };

  const isStudentCorrect = () => {
    return studentAnswer && poll.correctAnswerId && studentAnswer === poll.correctAnswerId;
  };

  const handleSetCorrectAnswer = (optionId: string) => {
    console.log('Setting correct answer:', optionId);
    socketService.setCorrectAnswer(optionId);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {poll.options.map((option, index) => {
          const percentage = getPercentage(option.votes);
          const isLeading = option.votes === maxVotes && option.votes > 0;
          const isCorrect = isCorrectAnswer(option.id);
          const isStudentAnswer = studentAnswer === option.id;
          
          return (
            <Box key={option.id}>
              <Card 
                variant="outlined" 
                sx={{ 
                  border: isCorrect ? '2px solid' : isLeading ? '2px solid' : '1px solid',
                  borderColor: isCorrect ? 'success.main' : isLeading ? 'primary.main' : 'divider',
                  bgcolor: isCorrect ? 'success.50' : isLeading ? 'primary.50' : 'background.paper'
                }}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {isCorrect && <CheckCircleIcon color="success" />}
                      {isStudentAnswer && <StarIcon color="warning" />}
                      <Typography 
                        variant="body1" 
                        fontWeight={isCorrect ? 'bold' : isLeading ? 'bold' : 'normal'}
                        color={isCorrect ? 'success.main' : 'inherit'}
                      >
                        {option.text}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1} alignItems="center">
                      {isTeacher && !poll.correctAnswerId && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleSetCorrectAnswer(option.id)}
                          startIcon={<CheckCircleIcon />}
                        >
                          Mark Correct
                        </Button>
                      )}
                      <Chip
                        label={`${option.votes} vote${option.votes !== 1 ? 's' : ''}`}
                        size="small"
                        color={isCorrect ? 'success' : isLeading ? 'primary' : 'default'}
                        variant={isCorrect ? 'filled' : isLeading ? 'filled' : 'outlined'}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {percentage}%
                      </Typography>
                    </Box>
                  </Box>
                  
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    color={getBarColor(option.votes, option.id)}
                    sx={{ 
                      height: 8, 
                      borderRadius: 4,
                      bgcolor: 'grey.200'
                    }}
                  />
                  
                  <Box display="flex" gap={1} mt={0.5}>
                    {isCorrect && (
                      <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CheckCircleIcon fontSize="small" />
                        Correct Answer
                      </Typography>
                    )}
                    {isStudentAnswer && (
                      <Typography variant="caption" color="warning.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon fontSize="small" />
                        Your Answer
                      </Typography>
                    )}
                    {isLeading && !isCorrect && (
                      <Typography variant="caption" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        🏆 Leading
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>

      <Box mt={2} p={2} bgcolor="grey.50" borderRadius={1}>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Total Votes: {totalVotes} • 
          {timeRemaining > 0 ? (
            <> Time Remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</>
          ) : (
            <> Poll Ended</>
          )}
        </Typography>
        
        {/* Student Performance Summary */}
        {studentAnswer && poll.correctAnswerId && (
          <Box mt={2} p={2} bgcolor={isStudentCorrect() ? 'success.50' : 'error.50'} borderRadius={1}>
            <Typography 
              variant="h6" 
              color={isStudentCorrect() ? 'success.main' : 'error.main'}
              textAlign="center"
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
            >
              {isStudentCorrect() ? (
                <>
                  <CheckCircleIcon />
                  Correct! Well done! 🎉
                </>
              ) : (
                <>
                  <CancelIcon />
                  Incorrect. Better luck next time! 💪
                </>
              )}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PollResults;
