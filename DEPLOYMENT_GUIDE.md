# 🚀 BlueBus — Production Deployment Guide

This guide walks you step-by-step through deploying both the **Backend API** and the **React Frontend** to production environments (such as Render, Vercel, Railway, or VPS) with zero downtime and automatic database initialization.

---

## 📋 Pre-Deployment Architecture Checklist

| Component | Technology | Recommended Host | Production Config |
| :--- | :--- | :--- | :--- |
| **Backend Server** | Node.js (Express) | **Render** / **Railway** | Runs `npm start`, listens on dynamic `PORT` |
| **Database** | MongoDB | **MongoDB Atlas** (Free Tier) | Set connection string in `MONGO_PATH` |
| **Frontend Web App** | React 18 SPA | **Vercel** / **Netlify** | Runs `npm run build`, outputs to `build/` |
| **Payment Gateway** | Razorpay | Razorpay Test/Live Keys | Configured in backend `.env` |

---

## 1️⃣ Step 1: Set Up MongoDB Database (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. Create a free **M0 Sandbox** cluster (e.g. AWS / Mumbai `ap-south-1`).
3. Under **Database Access**, create a database user:
   - Username: `bluebus_admin`
   - Password: `<your_secure_password>`
4. Under **Network Access**, add IP Address `0.0.0.0/0` (Allow access from anywhere).
5. Click **Connect** &rarr; **Connect your application** &rarr; copy the connection URI:
   ```env
   mongodb+srv://bluebus_admin:<your_secure_password>@cluster0.xxxx.mongodb.net/newbus?retryWrites=true&w=majority
   ```

> [!NOTE]
> The backend automatically creates and seeds all **45 Indian cities**, default bus routes, and the demo user on first boot if the database is brand new!

---

## 2️⃣ Step 2: Deploy Backend Server (e.g. Render / Railway)

### Option A: Render (Recommended for Backend)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** &rarr; **Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name:** `bluebus-backend`
   - **Root Directory:** `code/server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Add the following **Environment Variables** in Render:
   | Key | Example Value | Description |
   | :--- | :--- | :--- |
   | `MONGO_PATH` | `mongodb+srv://bluebus_admin:...` | Your MongoDB Atlas connection string |
   | `PORT` | `8080` | Server listening port (Render sets this dynamically) |
   | `JWT_SECRET` | `bluebus_jwt_secret_production_key_2026` | Random secret string for auth tokens |
   | `RAZORPAY_KEY_ID` | `rzp_test_5Jytv3WwjpYnLC` | Razorpay Key ID |
   | `RAZORPAY_KEY_SECRET` | `dfPl0F5OuZ1zoR2NxAVNccJu` | Razorpay Key Secret |
   | `NODEMAILERUSER` | `your-email@gmail.com` | Email address for ticket booking receipts |
   | `NODEMAILERPASSWORD` | `your-app-password` | Google 16-character App Password |
5. Click **Create Web Service**.
6. Once deployed, note down your backend public URL (e.g. `https://bluebus-backend.onrender.com`).
7. Test the health check endpoint in your browser:
   ```
   https://bluebus-backend.onrender.com/health
   ```
   Expected response: `{"status":"OK","dbState":"connected","uptimeSeconds":15}`

---

## 3️⃣ Step 3: Deploy Frontend (e.g. Vercel / Netlify)

### Option A: Vercel (Recommended for React SPA)
1. Go to [Vercel](https://vercel.com/) and click **Add New...** &rarr; **Project**.
2. Import your GitHub repository.
3. In the project setup screen:
   - **Framework Preset:** `Create React App`
   - **Root Directory:** click Edit and select `code/client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Expand **Environment Variables** and add:
   | Name | Value |
   | :--- | :--- |
   | `REACT_APP_API_URL` | `https://bluebus-backend.onrender.com` (Your deployed backend URL from Step 2) |
5. Click **Deploy**.
6. The included [`vercel.json`](file:///code/client/vercel.json) and [`public/_redirects`](file:///code/client/public/_redirects) ensure client-side routing (`/selectbus`, `/details/:id`, `/myticket`) works seamlessly on page reloads!

---

## 4️⃣ Verification & Smoke Testing

Once both services are deployed, perform this 3-minute smoke test:
1. Open your Vercel frontend URL (e.g. `https://bluebus.vercel.app`).
2. Search for buses from **Pune** to **Jalgaon** (or any route).
3. Verify that:
   - [x] Bus list loads with authentic operators (IntrCity, Orange Travels, VRL, etc.).
   - [x] **Departure Time** & **Arrival Time** filters work and update bus counts in real time.
   - [x] Select Seats opens the bus layout (`L1-L15` & `U1-U15` for Sleeper; `1-40` for Seater).
   - [x] Booking multiple tickets at once captures each passenger's name, age, and gender.
   - [x] **"📥 Download Ticket (PDF)"** generates high-resolution invoice `Bus_Ticket_${pnr}.pdf`.
   - [x] **BlueBot AI** floating assistant replies to booking inquiries and PNR status checks.

---

## 🛠️ Summary of Files Configured for Deployment

- ✅ [`code/server/index.js`](file:///code/server/index.js): Self-healing auto-seeder (`ensureInitialData`) for cities and demo user; `/health` endpoint for uptime monitoring.
- ✅ [`code/server/Procfile`](file:///code/server/Procfile): Ready for Heroku/Render/Railway standard process execution.
- ✅ [`code/server/package.json`](file:///code/server/package.json): Engine compatibility (`node >= 18.0.0`), `start` and `seed` scripts.
- ✅ [`code/client/vercel.json`](file:///code/client/vercel.json): Single Page App (SPA) rewrite rules for Vercel.
- ✅ [`code/client/public/_redirects`](file:///code/client/public/_redirects): SPA redirect rules for Netlify / Cloudflare Pages.
- ✅ [`code/client/src/config/api.js`](file:///code/client/src/config/api.js): Central dynamic API base URL reading `REACT_APP_API_URL`.

