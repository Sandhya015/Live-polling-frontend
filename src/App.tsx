import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { store } from './store';
import { socketService } from './services/socketService';
import RoleSelection from './components/RoleSelection';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store';
import { setUserType } from './store';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const AppContent: React.FC = () => {
  const dispatch = useDispatch();
  const { userType, isConnected } = useSelector((state: RootState) => state.app);

  useEffect(() => {
    // Connect to socket when app starts
    socketService.connect();

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Check for stored user type in localStorage
  useEffect(() => {
    const storedUserType = localStorage.getItem('userType') as 'teacher' | 'student' | null;
    if (storedUserType && isConnected) {
      dispatch(setUserType(storedUserType));
      // Join the appropriate room based on user type
      if (storedUserType === 'teacher') {
        socketService.joinAsTeacher();
      }
    }
  }, [dispatch, isConnected]);

  if (!isConnected) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div>Connecting to server...</div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Make sure the backend server is running on port 5000
        </div>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            padding: '8px 16px', 
            marginTop: '16px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!userType) {
    return <RoleSelection />;
  }

  return (
    <>
      {userType === 'teacher' && <TeacherDashboard />}
      {userType === 'student' && <StudentDashboard />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
};

export default App;