# Live Polling System

A real-time polling system built with React, Express.js, and Socket.io that allows teachers to create polls and students to participate in real-time.

## Features

### Teacher Features
- Create new polls with custom questions and options
- View live polling results in real-time
- Manage students (view connected students, remove students)
- Chat with students
- Configurable poll time limits (30s, 60s, 90s, 120s)
- View past poll results

### Student Features
- Enter unique name on first visit
- Answer poll questions in real-time
- View live results after submission
- 60-second time limit per question (configurable by teacher)
- Chat with teacher and classmates
- Real-time updates

### Technical Features
- Real-time communication using Socket.io
- Redux for state management
- Material-UI for modern, responsive design
- TypeScript for type safety
- Automatic reconnection handling
- Error handling and user feedback

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Backend**: Express.js with Socket.io
- **State Management**: Redux with Redux Thunk
- **UI Library**: Material-UI (MUI)
- **Real-time Communication**: Socket.io
- **Styling**: Material-UI components and custom CSS

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd Live-polling
```

### 2. Install backend dependencies
```bash
npm install
```

### 3. Install frontend dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Setup
Create a `.env` file in the root directory (optional):
```env
PORT=5000
CLIENT_URL=http://localhost:3000
```

### 5. Start the application

#### Option 1: Start both servers separately

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

#### Option 2: Start backend only (for production)
```bash
npm start
```

## Usage

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Choose your role**: Teacher or Student
3. **For Students**: Enter your name (must be unique)
4. **For Teachers**: Create polls and monitor results
5. **For Students**: Answer polls and view results

## API Endpoints

- `GET /api/polls` - Get all polls
- `GET /api/students` - Get all connected students

## Socket Events

### Client to Server
- `teacher-join` - Teacher joins the session
- `student-join` - Student joins with name
- `create-poll` - Teacher creates a new poll
- `submit-answer` - Student submits an answer
- `send-message` - Send chat message
- `remove-student` - Teacher removes a student

### Server to Client
- `teacher-connected` - Teacher connection confirmed
- `student-connected` - Student connection confirmed
- `poll-created` - New poll created
- `poll-results-updated` - Poll results updated
- `poll-ended` - Poll time expired
- `student-joined` - New student joined
- `student-left` - Student disconnected
- `student-answered` - Student submitted answer
- `new-message` - New chat message
- `error` - Error occurred

## Project Structure

```
Live-polling/
├── server.js              # Express server with Socket.io
├── package.json           # Backend dependencies
├── client/                # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # Socket service
│   │   ├── store/         # Redux store
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main App component
│   └── package.json       # Frontend dependencies
└── README.md
```

## Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables:
   - `CLIENT_URL=https://your-frontend-url.com`
3. Deploy the backend

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `client/build` folder
3. Set environment variable: `REACT_APP_SERVER_URL=https://your-backend-url.com`

## Development

### Available Scripts

**Backend:**
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

**Frontend:**
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Features Implementation Status

### ✅ Completed
- [x] Role selection (Teacher/Student)
- [x] Real-time poll creation and management
- [x] Student name entry and validation
- [x] Live poll results display
- [x] 60-second time limit with countdown
- [x] Chat functionality
- [x] Student management (view/remove)
- [x] Configurable poll time limits
- [x] Error handling and user feedback
- [x] Responsive design with Material-UI

### 🔄 In Progress
- [ ] Past poll results storage and display
- [ ] Enhanced UI following Figma design
- [ ] Performance optimizations

### 📋 Future Enhancements
- [ ] Database integration for persistent storage
- [ ] User authentication
- [ ] Poll templates
- [ ] Export poll results
- [ ] Mobile app support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
# Live-polling
# Live-polling
