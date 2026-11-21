# 🚌 Ticket Booking System — Complete Commands & Run Guide

This document contains all the commands to install, run, test, and manage the **Ticket Booking System**.

---

## ⚡ Quick Start (Double-Click Scripts)

In the root project folder, you can simply double-click:
* **`start_project.bat`** &mdash; Starts MongoDB, the Backend server, the Frontend web app, and opens `http://localhost:3000` in your browser.
* **`start_server.bat`** &mdash; Starts only the Node.js / Express backend on port `8080`.
* **`start_client.bat`** &mdash; Starts only the React frontend on port `3000`.

---

## 💻 Manual Commands (PowerShell / Terminal)

### 1. Prerequisites (MongoDB)
Ensure MongoDB is running locally:
```powershell
# Start MongoDB service (Run PowerShell as Administrator)
net start MongoDB

# Or run mongod directly
mongod
```
*Default Database URI:* `mongodb://127.0.0.1:27017/newbus`

---

### 2. Backend Server (Node.js & Express)
Runs on **`http://localhost:8080`**.

```powershell
# Step 1: Navigate to server folder from root
cd "code\server"

# Step 2: Install dependencies (only required once)
npm install

# Step 3: Start backend server with Nodemon
npm start
```

---

### 3. Frontend Client (React)
Runs on **`http://localhost:3000`**.

Open a **new terminal tab** and run:

```powershell
# Step 1: Navigate to client folder from root
cd "code\client"

# Step 2: Install dependencies (only required once)
npm install

# Step 3: Start React development server
npm start
```

---

### 4. One-Liner PowerShell Command (Run Both From Root)
Open a single PowerShell window in the project root and paste:

```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'code\server'; npm start"; Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'code\client'; npm start"
```

---

## 🌐 Live URLs & Endpoints

| Service | Address |
| :--- | :--- |
| **Frontend Web App** | [http://localhost:3000](http://localhost:3000) |
| **My Booked Tickets** | [http://localhost:3000/myticket](http://localhost:3000/myticket) |
| **Backend API Base** | [http://localhost:8080](http://localhost:8080) |
| **MongoDB Database** | `mongodb://127.0.0.1:27017/newbus` |

---

## 🔍 API Testing Commands (cURL / PowerShell)

### Search Buses
```powershell
curl.exe -s -X POST http://localhost:8080/bus/getall -H "Content-Type: application/json" -d "{\"from\": \"Mumbai\", \"to\": \"Pune\"}"
```

### View All Cities
```powershell
curl.exe -s http://localhost:8080/city
```

### View Single Ticket by Order ID / PNR
```powershell
curl.exe -s http://localhost:8080/order/ticket/6ae1aca568c7cad797e210fc
```

### View User Profile & Booking Stats
```powershell
curl.exe -s http://localhost:8080/user/profile/6ae1a67410754d944f0ccf5c
```

### Update Bus Details (Admin)
```powershell
curl.exe -s -X PUT http://localhost:8080/bus/663f20a60b62a4c6a5765b3c -H "Content-Type: application/json" -d "{\"price\": 2500, \"rating\": 4.8}"
```

---

## 📁 Directory Structure & Navigation Reference

```text
📁 35_Web Based Ticket Booking System (1)  <-- Root folder
   │
   ├── 📁 code
   │    ├── 📁 server   <-- Backend  (cd code\server)
   │    └── 📁 client   <-- Frontend (cd code\client)
   │
   ├── COMMANDS.md      <-- This guide
   ├── start_project.bat
   ├── start_server.bat
   └── start_client.bat
```

* **If in root folder:**
  * Backend: `cd "code\server"`
  * Frontend: `cd "code\client"`
* **If inside `code` folder:**
  * Backend: `cd server`
  * Frontend: `cd client`
* **If switching between folders:**
  * From `server` to `client`: `cd ..\client`
  * From `client` to `server`: `cd ..\server`

