# Backend deployment (Railway / Render)

The backend lives in the **`backend/`** folder. Use this so your Vercel frontend has a working backend URL for `REACT_APP_SERVER_URL`.

---

## Railway: set Root Directory to `backend`

Railway must build **only** the backend. If your build log shows **"copy backend/..., client/..., package.json"**, the Root Directory is wrong and the build will run the frontend build (and fail). Set it to **`backend`**.

### 1. Railway service settings

- **Root Directory**: set to **`backend`** (required).  
  In the service **Settings**, find **Root Directory** / **Build** and enter **`backend`** (no leading slash).  
  The build should then only copy/use files from `backend/`, and the build step will run a no-op (no frontend build).
- **Build command**: leave default (Railway runs `npm install` or `npm ci`).
- **Start command**: `node server.js` or `npm start` (both work; `backend/railway.json` sets this).
- **Watch paths** (optional): set to `backend/**` so only backend changes trigger deploys.

### 2. Check deployment and logs

- In Railway dashboard: **Deployments** → latest deployment → **View logs**.
- Confirm you see: `Server running on 0.0.0.0:XXXX` (port is set by Railway).
- If the build or start fails, fix the error shown in the logs (e.g. missing dependency, wrong path).

### 3. Use the correct URL

- In Railway: open your **service** → **Settings** → **Networking** → **Generate domain** (if needed).
- Use the **public URL** (e.g. `https://your-app.up.railway.app`) as your backend URL.
- Test in browser: `https://your-app.up.railway.app/` should return JSON:
  ```json
  { "message": "Live Polling System Backend API", "status": "running", ... }
  ```
- If you get HTML "Not Found", the service is not running or the domain is wrong — check logs and root directory.

### 4. Environment variables on Railway

You don’t need to set `PORT`; Railway sets it. Optionally set:

- `CLIENT_URL` or `FRONTEND_URL`: your Vercel frontend URL (e.g. `https://your-app.vercel.app`) so CORS allows it.  
  Your code already allows `https://*.vercel.app`; if you use a custom domain, set it here.

---

## Alternative: Deploy on Render (free tier)

If Railway keeps failing, use Render (supports Node + WebSockets):

1. Go to [render.com](https://render.com) → **New** → **Web Service**.
2. Connect the same GitHub repo. Set:
   - **Root directory**: **`backend`** (so only backend is built).
   - **Runtime**: Node.
   - **Build command**: `npm install` or `npm ci`.
   - **Start command**: `npm start` or `node server.js`.
3. **Create Web Service**. Render will assign a URL like `https://your-app.onrender.com`.
4. In **Environment** add (optional): `FRONTEND_URL` = `https://your-app.vercel.app`.
5. Use `https://your-app.onrender.com` as `REACT_APP_SERVER_URL` in Vercel.

**Note:** Free tier may spin down after inactivity; first request can be slow.

---

## Next steps after successful deploy

1. **Get your backend URL**  
   Railway → your service → **Settings** → **Networking** → copy the public URL (e.g. `https://your-app.up.railway.app`).

2. **Connect the frontend (Vercel)**  
   - Vercel → your frontend project → **Settings** → **Environment Variables**.  
   - Add: **`REACT_APP_SERVER_URL`** = your Railway backend URL (no trailing slash).  
   - **Redeploy** the Vercel app so the new variable is used.

3. **Test**  
   - Open your Vercel frontend URL → choose Teacher or Student → create/join and run a poll.  
   - Backend health: open `https://your-backend.up.railway.app/` in a browser; you should see JSON with `"status": "running"`.

---

## If the app is crashing

1. **Check Railway logs**  
   Railway → your service → **Deployments** → latest deploy → **View logs** (or **Logs** tab).  
   Look for the **exact error** (e.g. `Error: listen EADDRINUSE`, `Cannot find module`, stack trace).

2. **Start command**  
   In Railway **Settings** → **Deploy** / **Start**, use **`node server.js`** or **`npm start`** (no `cd`).  
   Root Directory must be **`backend`**, so the working directory is already the backend folder.

3. **Port**  
   Do **not** set `PORT` yourself. Railway sets `PORT`; the app uses `process.env.PORT`.

4. **Node version**  
   In Railway **Settings** → **Variables**, you can set **`NODE_VERSION`** = **`18`** or **`20`** if you see Node-related crashes.  
   Or in `backend/package.json` add under `"engines"`: `"node": "18.x"` and redeploy.

5. **Redeploy**  
   After changing start command or variables, trigger a **Redeploy** from the Railway dashboard.
