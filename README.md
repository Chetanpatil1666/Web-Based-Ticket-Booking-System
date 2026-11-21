# 🚌 BlueBus — Web-Based Bus Ticket Booking System

A full-stack, enterprise-grade online bus reservation platform built with **Node.js**, **Express.js**, **MongoDB**, and **React 18**.

Inspired by industry-leading platforms like **RedBus** and **MakeMyTrip**, BlueBus features live sleeper and seater seat selection, gender-aware berth protection (Ladies/Male), simultaneous multi-passenger booking, instant PNR receipt generation, payment integration, and a 24/7 AI travel assistant (**BlueBot AI**).

---

## ⚡ Quick Start (One-Click)

In the root project folder, simply double-click:
* **`start_project.bat`** &mdash; Automatically checks MongoDB, launches the Backend Server (port 8080), launches the React Frontend (port 3000), and opens the web app in your browser!

### Manual Terminal Commands:
```powershell
# Backend Server (Port 8080)
cd "code\server"
npm start

# Frontend App (Port 3000)
cd "code\client"
npm start
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

## 🌟 Key Features

1. **Modern RedBus-Style Hero & Search Card**: Floating elevated search interface with 1-click city swap (⇄), instant city autocomplete, date shortcuts, and popular route pills.
2. **Multi-Passenger Booking Engine**: Book multiple seats simultaneously (e.g. Seats 1 & 2) with individual names, ages, and mixed genders.
3. **Gender-Segregated Seat Berths**:
   * 🌸 **Pink Berths (`FaFemale`)**: Booked by female travelers; strictly protected for ladies' safety.
   * 🔵 **Slate-Blue Berths (`FaMale`)**: Booked by male travelers.
   * ⚪ **White Berths**: Open for booking.
   * 🟢 **Green Berths**: Currently selected.
4. **Double-Booking Shield & Seat Release**: Atomic server checks prevent seat conflicts; cancellations immediately release all multi-seat berths back to the pool.
5. **Conversational BlueBot AI**: Real-time AI support widget with thinking state toggle, PNR verification, route recommendations, and FAQ resolution.
6. **15+ Luxury Buses per Route**: Comprehensive fleet provisioning with IntrCity SmartBus, Orange Travels, VRL, Zingbus Electric, SRS Travels, and more.

---

## 📖 Complete Documentation Files

* 👉 **[`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)** &mdash; Full step-by-step production deployment guide for Render, Vercel, Railway, and MongoDB Atlas.
* 👉 **[`PROJECT_DETAILS.md`](./PROJECT_DETAILS.md)** &mdash; Full system architecture, database schemas, REST API documentation, and testing walkthrough.
* 👉 **[`COMMANDS.md`](./COMMANDS.md)** &mdash; Comprehensive list of commands, PowerShell scripts, and cURL API test queries.
