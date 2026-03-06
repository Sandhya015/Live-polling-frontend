# Deploy Live Polling Frontend on Vercel

## Prerequisites

- GitHub repo with this code (or Vercel CLI)
- Backend already deployed (e.g. Railway) so you have a backend URL for Socket.io

## Option 1: Deploy via Vercel Dashboard (recommended)

1. **Sign in**  
   Go to [vercel.com](https://vercel.com) and sign in with GitHub.

2. **Import project**  
   - Click **Add New… → Project**.  
   - Import your `Live-polling` repo.  
   - In **Root Directory**, set **client** (so Vercel builds the React app, not the root).

3. **Build settings** (usually auto-detected for Create React App)  
   - **Build Command:** `npm run build`  
   - **Output Directory:** `build`  
   - **Install Command:** `npm install`

4. **Environment variable**  
   In **Settings → Environment Variables**, add:
   - **Name:** `REACT_APP_SERVER_URL`  
   - **Value:** your backend URL (e.g. `https://live-polling-backend-production-8ab9.up.railway.app`)  
   - Apply to **Production** (and Preview if you want).

5. **Deploy**  
   Click **Deploy**. After the build, you’ll get a URL like `https://your-project.vercel.app`.

6. **Backend CORS**  
   Your backend (`server.js`) already allows `https://*.vercel.app`. If you use a custom domain on Vercel, add that origin to the `cors` and Socket.io `origin` list in `server.js`.

---

## Option 2: Deploy with Vercel CLI

```bash
# Install Vercel CLI once
npm i -g vercel

# From repo root: deploy the client folder
cd client
vercel

# Follow prompts (link to existing project or create new one).
# Set env when prompted or in Dashboard:
# REACT_APP_SERVER_URL=https://your-backend-url.railway.app
```

For production:

```bash
cd client
vercel --prod
```

---

## Summary

| Setting              | Value                                      |
|----------------------|--------------------------------------------|
| Root Directory       | `client`                                   |
| Build Command        | `npm run build`                            |
| Output Directory     | `build`                                    |
| Env var              | `REACT_APP_SERVER_URL` = your backend URL   |

The `client/vercel.json` in this repo sets the output directory and SPA rewrites (all routes → `index.html`). After deployment, open the Vercel URL and use the app; the frontend will connect to the backend using `REACT_APP_SERVER_URL`.
