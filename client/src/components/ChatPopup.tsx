import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Chip,
  IconButton,
  Paper
} from '@mui/material';
import {
  Send as SendIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  School as SchoolIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { socketService } from '../services/socketService';
import { ChatMessage } from '../types';

interface ChatPopupProps {
  open: boolean;
  onClose: () => void;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { userType, student, chatMessages } = useSelector((state: RootState) => state.app);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const senderName = userType === 'teacher' ? 'Teacher' : student?.name || 'Student';
    socketService.sendMessage(message.trim(), senderName, userType || 'student');
    setMessage('');
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { height: '70vh' }
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Chat</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ p: 0, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          <List>
            {chatMessages.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No messages yet"
                  secondary="Start the conversation!"
                  sx={{ textAlign: 'center' }}
                />
              </ListItem>
            ) : (
              chatMessages.map((msg) => (
                <ListItem key={msg.id} sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                  <Box display="flex" alignItems="center" mb={0.5}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
                      {msg.senderType === 'teacher' ? <SchoolIcon /> : <PersonIcon />}
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {msg.senderName}
                    </Typography>
                    <Chip
                      label={msg.senderType}
                      size="small"
                      color={msg.senderType === 'teacher' ? 'primary' : 'secondary'}
                      sx={{ ml: 1, height: 20 }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                      {formatTime(msg.timestamp)}
                    </Typography>
                  </Box>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      bgcolor: msg.senderType === 'teacher' ? 'primary.50' : 'grey.100',
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="body2">
                      {msg.message}
                    </Typography>
                  </Paper>
                </ListItem>
              ))
            )}
            <div ref={messagesEndRef} />
          </List>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          multiline
          maxRows={3}
          variant="outlined"
          size="small"
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          onClick={handleSendMessage}
          disabled={!message.trim()}
          startIcon={<SendIcon />}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChatPopup;
