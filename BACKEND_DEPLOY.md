# Backend deployment (Railway / Render)

Use this so your Vercel frontend has a working backend URL for `REACT_APP_SERVER_URL`.

---

## If Railway shows "Not Found"

### 1. Check Railway service settings

- **Root directory**: leave **empty** (repo root). Your `server.js` and `package.json` are in the root.
- **Build command**: leave default (Railway runs `npm install`).
- **Start command**: `node server.js` (or `npm start`). Your `railway.json` already sets this.
- **Watch paths**: leave default so pushes to this repo trigger deploys.

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
   - **Root directory**: leave empty.
   - **Runtime**: Node.
   - **Build command**: `npm install`.
   - **Start command**: `npm start` or `node server.js`.
3. **Create Web Service**. Render will assign a URL like `https://your-app.onrender.com`.
4. In **Environment** add (optional): `FRONTEND_URL` = `https://your-app.vercel.app`.
5. Use `https://your-app.onrender.com` as `REACT_APP_SERVER_URL` in Vercel.

**Note:** Free tier may spin down after inactivity; first request can be slow.

---

## After the backend is running

1. Copy the backend URL (e.g. `https://xxx.up.railway.app` or `https://xxx.onrender.com`).
2. In **Vercel** → your project → **Settings** → **Environment Variables**:
   - Add `REACT_APP_SERVER_URL` = that backend URL.
3. Redeploy the frontend on Vercel so the new variable is applied.
