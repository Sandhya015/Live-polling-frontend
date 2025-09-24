import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import { AppState, Student, Poll, ChatMessage } from '../types';

// Action Types
export const ActionTypes = {
  SET_USER_TYPE: 'SET_USER_TYPE',
  SET_STUDENT: 'SET_STUDENT',
  SET_CURRENT_POLL: 'SET_CURRENT_POLL',
  SET_STUDENTS: 'SET_STUDENTS',
  SET_POLLS: 'SET_POLLS',
  SET_TIME_REMAINING: 'SET_TIME_REMAINING',
  ADD_CHAT_MESSAGE: 'ADD_CHAT_MESSAGE',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_ALL_DATA: 'CLEAR_ALL_DATA',
  UPDATE_POLL_RESULTS: 'UPDATE_POLL_RESULTS',
  STUDENT_JOINED: 'STUDENT_JOINED',
  STUDENT_LEFT: 'STUDENT_LEFT',
  STUDENT_ANSWERED: 'STUDENT_ANSWERED',
  STUDENT_REMOVED: 'STUDENT_REMOVED'
} as const;

// Action Creators
export const setUserType = (userType: 'teacher' | 'student' | null) => ({
  type: ActionTypes.SET_USER_TYPE,
  payload: userType
});

export const setStudent = (student: Student | null) => ({
  type: ActionTypes.SET_STUDENT,
  payload: student
});

export const setCurrentPoll = (poll: Poll | null) => ({
  type: ActionTypes.SET_CURRENT_POLL,
  payload: poll
});

export const setStudents = (students: Student[]) => ({
  type: ActionTypes.SET_STUDENTS,
  payload: students
});

export const setPolls = (polls: Poll[]) => ({
  type: ActionTypes.SET_POLLS,
  payload: polls
});

export const setTimeRemaining = (timeRemaining: number) => ({
  type: ActionTypes.SET_TIME_REMAINING,
  payload: timeRemaining
});

export const addChatMessage = (message: ChatMessage) => ({
  type: ActionTypes.ADD_CHAT_MESSAGE,
  payload: message
});

export const setConnectionStatus = (isConnected: boolean) => ({
  type: ActionTypes.SET_CONNECTION_STATUS,
  payload: isConnected
});

export const setError = (error: string) => ({
  type: ActionTypes.SET_ERROR,
  payload: error
});

export const clearError = () => ({
  type: ActionTypes.CLEAR_ERROR
});

export const updatePollResults = (poll: Poll) => ({
  type: ActionTypes.UPDATE_POLL_RESULTS,
  payload: poll
});

export const studentJoined = (student: Student) => ({
  type: ActionTypes.STUDENT_JOINED,
  payload: student
});

export const studentLeft = (student: Student) => ({
  type: ActionTypes.STUDENT_LEFT,
  payload: student
});

export const studentAnswered = (data: { student: string; answer: string }) => ({
  type: ActionTypes.STUDENT_ANSWERED,
  payload: data
});

export const studentRemoved = (student: Student) => ({
  type: ActionTypes.STUDENT_REMOVED,
  payload: student
});

// Reducers
const initialState: AppState = {
  userType: null,
  student: null,
  currentPoll: null,
  students: [],
  polls: [],
  timeRemaining: 0,
  chatMessages: [],
  isConnected: false,
  error: null
};

const appReducer = (state = initialState, action: any): AppState => {
  switch (action.type) {
    case ActionTypes.SET_USER_TYPE:
      return { ...state, userType: action.payload };
    
    case ActionTypes.SET_STUDENT:
      return { ...state, student: action.payload };
    
    case ActionTypes.SET_CURRENT_POLL:
      return { ...state, currentPoll: action.payload };
    
    case ActionTypes.SET_STUDENTS:
      return { ...state, students: action.payload };
    
    case ActionTypes.SET_POLLS:
      return { ...state, polls: action.payload };
    
    case ActionTypes.SET_TIME_REMAINING:
      return { ...state, timeRemaining: action.payload };
    
    case ActionTypes.ADD_CHAT_MESSAGE:
      return { 
        ...state, 
        chatMessages: [...state.chatMessages, action.payload] 
      };
    
    case ActionTypes.SET_CONNECTION_STATUS:
      return { ...state, isConnected: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ActionTypes.CLEAR_ALL_DATA:
      return {
        ...initialState,
        isConnected: state.isConnected // Keep connection status
      };
    
    case ActionTypes.UPDATE_POLL_RESULTS:
      return { ...state, currentPoll: action.payload };
    
    case ActionTypes.STUDENT_JOINED:
      return { 
        ...state, 
        students: [...state.students, action.payload] 
      };
    
    case ActionTypes.STUDENT_LEFT:
      return { 
        ...state, 
        students: state.students.filter(s => s.id !== action.payload.id) 
      };
    
    case ActionTypes.STUDENT_ANSWERED:
      return state; // This is handled by the socket listener
    
    case ActionTypes.STUDENT_REMOVED:
      return { 
        ...state, 
        students: state.students.filter(s => s.id !== action.payload.id) 
      };
    
    default:
      return state;
  }
};

// Root Reducer
const rootReducer = combineReducers({
  app: appReducer
});

// Store
export const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);

export type RootState = ReturnType<typeof rootReducer>;
