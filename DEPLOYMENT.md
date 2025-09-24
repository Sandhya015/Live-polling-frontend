# Deployment Guide

## Frontend Deployment (Netlify)

### Step 1: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Click "New site from Git"
4. Connect your GitHub repository: `Sandhya015/Live-polling`
5. Configure build settings:
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`
6. Click "Deploy site"

### Step 2: Set Environment Variables
After deployment, go to Site Settings → Environment Variables:
- **REACT_APP_SERVER_URL**: `https://live-polling-backend-production-8ab9.up.railway.app`

## Backend Deployment (Railway)

### Step 1: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository: `Sandhya015/Live-polling`
5. Railway will automatically detect it's a Node.js project
6. Deploy!

### Step 2: Get Backend URL
After deployment, Railway will give you a URL like:
`https://your-app-name.railway.app`

### Step 3: Update Frontend
Go back to Netlify and update the environment variable:
- **REACT_APP_SERVER_URL**: `https://live-polling-backend-production-8ab9.up.railway.app`

## Alternative: Deploy Both to Render

### Frontend on Render
1. Go to [render.com](https://render.com)
2. Create "Static Site"
3. Connect GitHub repo: `Sandhya015/Live-polling`
4. Set:
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Publish Directory**: `build`

### Backend on Render
1. Create "Web Service"
2. Connect GitHub repo: `Sandhya015/Live-polling`
3. Set:
   - **Root Directory**: `/` (root)
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

## Environment Variables

### Frontend (.env.production)
```
REACT_APP_SERVER_URL=https://live-polling-backend-production-8ab9.up.railway.app
```

### Backend (Railway Environment Variables)
```
NODE_ENV=production
PORT=5000
```

## Testing Deployment

1. **Frontend**: Visit your Netlify URL
2. **Backend**: Test with `curl https://live-polling-backend-production-8ab9.up.railway.app`
3. **Full App**: Create a poll as teacher, join as student

## Troubleshooting

### Common Issues:
1. **CORS Error**: Backend needs to allow your frontend domain
2. **Socket.io Connection**: Make sure WebSocket is enabled
3. **Environment Variables**: Double-check URLs are correct

### Backend CORS Fix:
Add your frontend domain to the CORS origins in `server.js`:
```javascript
const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-frontend-url.netlify.app'],
  credentials: true
};
```

## Cost
- **Netlify**: Free tier (100GB bandwidth/month)
- **Railway**: Free tier (500 hours/month)
- **Total**: $0/month for small projects
