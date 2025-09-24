# Live Polling System

A real-time polling system built with React, Redux, Express.js, and Socket.io. This application allows teachers to create polls and students to answer them in real-time.

## Features

### Teacher Features
- Create polls with multiple choice questions
- Set correct answers during poll creation
- View live polling results
- Monitor student participation
- Remove students from the session
- View past poll results with correct answers highlighted
- Real-time chat with students

### Student Features
- Join sessions with a unique name
- Answer polls in real-time
- View live results after submission
- See if their answer was correct
- Chat with teacher and other students too

## Technology Stack

- **Frontend**: React 18, Redux, TypeScript, Material-UI
- **Backend**: Node.js, Express.js, Socket.io
- **Real-time Communication**: WebSockets
- **State Management**: Redux with Redux Thunk

## Project Structure

```
Live-polling/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # Socket.io service
│   │   ├── store/          # Redux store
│   │   └── types/          # TypeScript types
│   └── package.json
├── server.js              # Express.js backend
├── package.json           # Backend dependencies
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
```bash
cd Live-polling
npm install
npm start
```
The backend server will run on port 5000.

### Frontend Setup
```bash
cd client
npm install
npm start
```
The frontend will run on port 3000.

## Usage

1. **Start the application**:
   - Run the backend server: `npm start` (from root directory)
   - Run the frontend: `npm start` (from client directory)

2. **As a Teacher**:
   - Select "Teacher" role
   - Create polls with questions and options
   - Mark correct answers during creation
   - Monitor student responses in real-time
   - View past poll results

3. **As a Student**:
   - Select "Student" role
   - Enter your name to join the session
   - Answer active polls
   - View results and see if you were correct

## API Endpoints

- `GET /` - Health check
- WebSocket events:
  - `teacher-join` - Teacher joins the session
  - `student-join` - Student joins with name
  - `create-poll` - Create a new poll
  - `submit-answer` - Submit student answer
  - `set-correct-answer` - Mark correct answer
  - `remove-student` - Remove student from session

## Deployment

### Frontend Deployment
The frontend can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Backend Deployment
The backend can be deployed to:
- Heroku
- AWS EC2
- DigitalOcean
- Railway

### Environment Variables
Create a `.env` file in the root directory:
```
PORT=5000
NODE_ENV=production
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Screenshots

### Teacher Dashboard
- Create polls with correct answers
- Monitor student participation
- View live results and past polls

### Student Dashboard
- Join sessions with unique names
- Answer polls in real-time
- See correct answers and performance feedback

## Future Enhancements

- [ ] Database integration for persistent storage
- [ ] User authentication and authorization
- [ ] Poll templates and categories
- [ ] Advanced analytics and reporting
- [ ] Mobile app support
- [ ] Poll scheduling and automation