# Live Polling System - Frontend

A real-time polling system frontend built with React, TypeScript, Redux, and Socket.io.

## Features

- **Teacher Dashboard**: Create polls, view live results, manage students
- **Student Dashboard**: Answer polls, view results, real-time updates
- **Real-time Communication**: Socket.io for live updates
- **Correct Answer Marking**: Teachers can mark correct answers
- **Live Chat**: Real-time chat between teachers and students
- **Responsive Design**: Material-UI components with modern UI

## Tech Stack

- **React 19** with TypeScript
- **Redux** for state management
- **Material-UI** for UI components
- **Socket.io-client** for real-time communication
- **React Scripts** for build tooling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running (see backend repository)

### Installation

1. Clone the repository:
```bash
git clone <frontend-repo-url>
cd live-polling-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set environment variables:
```bash
# For development
export REACT_APP_SERVER_URL=http://localhost:5000

# For production (replace with your backend URL)
export REACT_APP_SERVER_URL=https://your-backend-url.railway.app
```

4. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## Environment Variables

- `REACT_APP_SERVER_URL`: Backend server URL (default: http://localhost:5000)

## Deployment

### Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variable: `REACT_APP_SERVER_URL=https://your-backend-url.railway.app`
5. Deploy

### Vercel

1. Connect your repository to Vercel
2. Set environment variable: `REACT_APP_SERVER_URL=https://your-backend-url.railway.app`
3. Deploy

## Project Structure

```
src/
├── components/          # React components
│   ├── TeacherDashboard.tsx
│   ├── StudentDashboard.tsx
│   ├── PollResults.tsx
│   ├── RoleSelection.tsx
│   └── ChatPopup.tsx
├── services/           # API and Socket.io services
│   └── socketService.ts
├── store/              # Redux store and reducers
│   └── index.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx             # Main App component
└── index.tsx           # Entry point
```

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License