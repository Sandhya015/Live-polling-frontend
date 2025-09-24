export interface Student {
  id: string;
  name: string;
  hasAnswered: boolean;
  currentAnswer: string | null;
  joinedAt: Date;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  correctAnswerId?: string;
  timeLimit: number;
  createdAt: Date;
  status: 'active' | 'ended';
  endedAt?: Date;
}

export interface ChatMessage {
  id: string;
  message: string;
  senderName: string;
  senderType: 'teacher' | 'student';
  timestamp: Date;
}

export interface AppState {
  userType: 'teacher' | 'student' | null;
  student: Student | null;
  currentPoll: Poll | null;
  students: Student[];
  polls: Poll[];
  timeRemaining: number;
  chatMessages: ChatMessage[];
  isConnected: boolean;
  error: string | null;
}

export interface CreatePollData {
  question: string;
  options: string[];
  timeLimit?: number;
  correctAnswerIndex?: number | null;
}

export interface SubmitAnswerData {
  optionId: string;
}
