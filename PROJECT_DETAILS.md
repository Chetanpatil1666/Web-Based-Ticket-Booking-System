# 🚌 BlueBus — Web-Based Bus Ticket Booking System
## Complete Project Documentation & Technical Architecture

---

## 📌 Executive Summary
**BlueBus** is a full-stack, enterprise-grade online bus reservation platform inspired by industry leaders like **RedBus** and **MakeMyTrip**. The system features real-time sleeper and seater seat selection, gender-aware berth protection (Ladies/Male), simultaneous multi-passenger bookings with mixed genders, instant PNR receipt generation, payment gateway integration, and a 24/7 conversational AI assistant (**BlueBot AI**).

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend Framework** | React.js (v18.2), React DOM |
| **State Management** | Redux, Redux Thunk, React-Redux |
| **Routing & Navigation** | React Router DOM (v6.8) |
| **Styling & UI Components** | CSS Modules, Custom Modern Flexbox/Grid, Bootstrap 5, React Icons (`Fa`, `Bi`, `Ai`, `Gi`) |
| **Client Storage & Auth** | `js-cookie`, `sessionStorage`, JWT Tokens |
| **Backend Runtime** | Node.js (v18+), Express.js |
| **Database & ODM** | MongoDB (Local / Atlas), Mongoose (v6.10) |
| **Security & Utilities** | JSONWebToken (JWT), CORS, Crypto, Dotenv, Moment.js |
| **Payment Integration** | Razorpay SDK + UPI / Card / NetBanking Mock Gateway |
| **Automated Launcher** | Windows Batch Scripts (`.bat`) with PowerShell execution |

---

## 🏛️ System Architecture

```mermaid
graph TD
    User["👤 Passenger / User"] -->|Browser localhost:3000| Client["React Frontend Client"]
    Client -->|Redux & Router| UIComponents["UI Layer: Navbar, Hero, SeatMap, Details, MyTicket, BlueBot"]
    Client -->|REST API Calls (Axios)| Server["Node.js Express Backend (:8080)"]
    
    subgraph Backend Services
        Server --> CityCtrl["City Controller (/city)"]
        Server --> BusCtrl["Bus Controller (/bus)"]
        Server --> OrderCtrl["Order Controller (/order)"]
        Server --> UserCtrl["User Controller (/user)"]
        Server --> AICtrl["AI Controller (/ai)"]
        Server --> PaymentCtrl["Payment Controller (/api/payment)"]
    end
    
    subgraph Database Layer
        CityCtrl --> MongoDB[("MongoDB Database: newbus")]
        BusCtrl --> MongoDB
        OrderCtrl --> MongoDB
        UserCtrl --> MongoDB
        AICtrl --> MongoDB
    end
```

---

## 🌟 Key Features & Innovations

### 1. Modern RedBus-Style Hero & Search Bar
* **Interactive Floating Search Card**: Elevated 4-column responsive layout with smooth shadows.
* **1-Click City Swap (⇄)**: Seamlessly inverts departure and destination cities with a 180° rotation animation.
* **Instant Route Suggestions**: Live auto-suggest dropdowns powered by MongoDB text indexing.
* **Date Shortcuts**: Instant **[Today]** and **[Tomorrow]** selection buttons.
* **Quick Popular Routes**: Direct 1-click pills for *Mumbai ➔ Pune*, *Mumbai ➔ Bengaluru*, *Delhi ➔ Jaipur*, *Pune ➔ Goa*, and *Bengaluru ➔ Hyderabad*.

### 2. Multi-Passenger Booking Engine (Mixed Genders)
* Allows passengers to book **multiple seats simultaneously** in a single checkout.
* **Step 1 (Passenger Details)**: Dynamically generates individual cards for each selected seat (Seat 1, Seat 2, etc.) to capture specific Name, Age, and Gender (`Male` or `Female`).
* **Visual Card Theming**: Male passenger cards render in **Blue** with `🔵 Male Passenger` badge; Female passenger cards render in **Pink** with `🌸 Ladies / Female` badge.
* **Step 2 (Fare Summary)**: Complete breakdown showing each passenger's name, age, seat number, and gender badge.
* **Step 3 (Confirmed Receipt)**: Live boarding pass with unique PNR, operator details, and passenger roster.

### 3. Industry-Standard Gender-Segregated Seat Layout
* **30-Berth Sleeper Coach**: 15 Lower Deck berths + 15 Upper Deck berths.
* **🌸 Pink Berths (`FaFemale`)**: Booked by female travelers. Marked `FEMALE` and strictly reserved for ladies' safety. Clicking alerts: *"Seat X is booked by a female passenger (Ladies seat). Please select another seat."*
* **🔵 Slate-Blue Berths (`FaMale`)**: Booked by male travelers. Marked `MALE`.
* **⚪ White Berths**: Open and available for instant booking.
* **🟢 Green Berths**: Currently selected seats in active transaction.

### 4. Double-Booking Prevention & Seat Pool Release
* **Double-Booking Shield**: Server checks `ticketSummary.date` and seat numbers against the `Order` collection. Returns HTTP 409 Conflict if any requested seat is already booked for that date.
* **Multi-Seat Cancellation**: Cancelling a booking (e.g. `Seats 1, 2`) parses the full seat list and immediately releases all berths back into `BusModel.seats`.

### 5. Conversational BlueBot AI Assistant
* Floating, draggable support widget with **expandable thinking state**.
* Capabilities:
  * **Live PNR Status**: Parses PNR codes (e.g. `PNR-E210FC`) and displays live journey, seats, and passenger breakdown.
  * **Smart Recommendations**: Evaluates budget vs luxury bus preferences based on ratings, prices, and amenities.
  * **Gender Seat Rules**: Explains Pink vs Blue berth policies.
  * **Payment & Refund Support**: Step-by-step assistance for transaction questions.

### 6. Comprehensive Bus Fleet
* Auto-provisions **at least 15 scheduled luxury buses per route** across all time slots:
  * *IntrCity SmartBus Volvo Club*
  * *Orange Travels Gold Class*
  * *VRL Travels I-Shift Sleeper*
  * *Zingbus Electric Plus*
  * *SRS Travels Volvo Multi-Axle*
  * *Chartered Speed AC Seater*
  * *Neeta Tours & Travels Mercedes Multi-Axle*

---

## 🗄️ Database Schemas (Mongoose)

### 1. `OrderModel` (`src/models/order.model.js`)
```javascript
const orderSchema = new mongoose.Schema(
  {
    busDetails: {
      name: String,
      from: String,
      to: String,
      contactemail: String,
      contactphone: Number,
      arrival: String,
      departure: String,
    },
    ticketSummary: {
      date: Date,
      ticket: String, // e.g. "1, 2"
      amount: Number,
    },
    paymentDetails: {
      orderId: String,
      razorpayOrderId: String,
      razorpayPaymentId: String,
    },
    userDetails: {
      name: String,
      age: Schema.Types.Mixed,
      gender: String, // "male" or "female"
      email: String,
      phone: Schema.Types.Mixed,
    },
    // Multi-Passenger roster per seat
    passengers: [
      {
        seat: String,
        name: String,
        age: Schema.Types.Mixed,
        gender: String, // "male" or "female"
      },
    ],
    bus: { type: Schema.Types.ObjectId, ref: "bus" },
    user: { type: Schema.Types.ObjectId, ref: "user" },
  },
  { timestamps: true }
);
```

### 2. `BusModel` (`src/models/bus.model.js`)
```javascript
const busSchema = new mongoose.Schema(
  {
    companyname: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    price: { type: Number, required: true },
    seats: [String], // Format: "YYYY-MM-DD@seatNumber@gender"
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    aminites: [String],
    rating: { type: Number, default: 4.5 },
    departure: { type: String, default: "08:00" },
    arrival: { type: String, default: "11:30" },
  },
  { timestamps: true }
);
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/bus/getall` | Searches buses by `from` and `to` cities with automatic 15+ fleet provisioning. |
| `POST` | `/bus/one` | Fetches a single bus by ID and date, returning `bookedSeatsList` and `bookedSeatsGender`. |
| `GET` | `/bus/:id` | Returns single bus details by ID. |
| `PUT` | `/bus/:id` | Updates bus pricing, amenities, or ratings. |
| `POST` | `/order` | Creates a new confirmed order with double-booking prevention. |
| `POST` | `/order/myticket` | Fetches all confirmed orders for a user. |
| `DELETE`| `/order/oneorder/:id` | Cancels ticket and frees seats in `BusModel`. |
| `GET` | `/order/ticket/:id` | Returns single ticket details by Order ID. |
| `POST` | `/user/signup` | Registers new user account with gender & email. |
| `POST` | `/user/login` | Authenticates user and returns 7-day JWT token. |
| `POST` | `/ai/chat` | Conversational BlueBot AI query handler with thinking state. |
| `POST` | `/ai/recommend` | AI algorithm ranking buses by budget, luxury, or balanced scoring. |
| `POST` | `/city/showcity` | Validates city names and auto-registers new routes. |

---

## ⚡ Quick Start & Run Commands

### Method 1: Double-Click One-Step Launcher
Double-click **`start_project.bat`** in the project root folder. It will:
1. Verify the MongoDB local service.
2. Launch the backend server on `http://localhost:8080`.
3. Launch the frontend client on `http://localhost:3000`.
4. Open your browser directly to the web app.

### Method 2: Manual Terminal Commands
```powershell
# 1. Start Backend Server
cd "code\server"
npm start

# 2. Start Frontend Client (in a separate terminal)
cd "code\client"
npm start
```

---

## 🧪 End-to-End Testing Walkthrough

1. **Search Buses**:
   - Open [http://localhost:3000](http://localhost:3000).
   - Enter `Mumbai` in **From** and `Pune` in **To** (or click the `Mumbai ➔ Pune` popular route pill).
   - Click **`SEARCH BUSES`**.
2. **Select Bus**:
   - Filter by Sleeper / AC or select any bus card.
   - Click **`Select Seats →`**.
3. **Multi-Seat Selection**:
   - Click **Seat 1** and **Seat 2**. Both turn green (Selected).
   - Click **Proceed to Passenger Details**.
4. **Assign Genders**:
   - Passenger 1 (Seat 1): Enter `Rahul Sharma`, Age `28`, Gender `Male`.
   - Passenger 2 (Seat 2): Enter `Priya Sharma`, Age `26`, Gender `Female` (Card turns Pink).
   - Click **Proceed to Payment**.
5. **Confirmation**:
   - Select UPI, Card, or Net Banking and click **Pay Securely**.
   - Review your confirmed ticket with PNR and individual passenger badges.
6. **Verify Seat Map**:
   - Return to the bus seat layout for that date.
   - **Seat 1** renders in Blue with `FaMale` (Male Booked).
   - **Seat 2** renders in Pink with `FaFemale` (Female Booked).

---

*Documentation compiled and verified on November 6, 2026.*

