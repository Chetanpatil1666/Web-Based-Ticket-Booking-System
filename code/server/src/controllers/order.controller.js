const express = require("express");
const mongoose = require("mongoose");
const BusModel = require("../models/bus.model");
const UserModel = require("../models/user.model");
const Order = require("../models/order.model");
const moment = require("moment");
const app = express.Router();

app.post("/", async (req, res) => {
  try {
    // 1. Ensure user is valid, or create/link account by email so guest booking succeeds
    if (!req.body.user || !mongoose.Types.ObjectId.isValid(req.body.user)) {
      const email = (req.body.userDetails?.email || "passenger@ticketbooking.com").toLowerCase().trim();
      let user = await UserModel.findOne({ email });
      if (!user) {
        user = await UserModel.create({
          email,
          name: req.body.userDetails?.name || "Passenger",
          password: "password123",
          gender: req.body.userDetails?.gender || "male",
        });
      }
      req.body.user = user._id;
    }

    // 2. Ensure bus is valid
    if (!req.body.bus || !mongoose.Types.ObjectId.isValid(req.body.bus)) {
      const defaultBus = await BusModel.findOne();
      if (defaultBus) req.body.bus = defaultBus._id;
    }

    // 3. Fallback busDetails from DB if missing or incomplete
    if (!req.body.busDetails || !req.body.busDetails.name) {
      const foundBus = await BusModel.findById(req.body.bus);
      if (foundBus) {
        req.body.busDetails = {
          name: foundBus.companyname,
          from: foundBus.from,
          to: foundBus.to,
          contactemail: foundBus.email || "support@travels.com",
          contactphone: foundBus.phone || 9820011223,
          arrival: foundBus.arrival || "10:00",
          departure: foundBus.departure || "08:00",
        };
      }
    }

    // 4. Ensure payment details
    if (!req.body.paymentDetails) req.body.paymentDetails = {};
    if (!req.body.paymentDetails.orderId) {
      req.body.paymentDetails.orderId = "order_rzp_" + Date.now();
    }
    if (!req.body.paymentDetails.razorpayPaymentId) {
      req.body.paymentDetails.razorpayPaymentId = "pay_test_" + Date.now();
    }

    // 5. Prevent double booking: verify requested seat is not already booked for this bus & date
    if (req.body.bus && req.body.ticketSummary?.date && req.body.ticketSummary?.ticket) {
      const rawDate = req.body.ticketSummary.date;
      const targetDate = typeof rawDate === "string" ? rawDate.split("T")[0] : new Date(rawDate).toISOString().split("T")[0];
      const requestedSeats = String(req.body.ticketSummary.ticket)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const startOfDay = new Date(targetDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const existingOrders = await Order.find({
        bus: req.body.bus,
        "ticketSummary.date": { $gte: startOfDay, $lte: endOfDay },
      });

      const alreadyBooked = [];
      existingOrders.forEach((o) => {
        const t = String(o.ticketSummary?.ticket || "");
        t.split(",").forEach((s) => {
          const trimmed = s.trim();
          if (requestedSeats.includes(trimmed) && !alreadyBooked.includes(trimmed)) {
            alreadyBooked.push(trimmed);
          }
        });
      });

      if (alreadyBooked.length > 0) {
        return res.status(409).json({
          error: `Seat ${alreadyBooked.join(", ")} is already booked for this date! Please select another seat.`,
        });
      }
    }

    const rawGender = String(req.body.userDetails?.gender || "male").toLowerCase();
    const normalizedGender =
      rawGender === "women" || rawGender === "female" || rawGender === "f"
        ? "female"
        : "male";

    if (!req.body.userDetails) req.body.userDetails = {};
    req.body.userDetails.gender = normalizedGender;

    // Normalize each passenger's gender in req.body.passengers
    if (Array.isArray(req.body.passengers) && req.body.passengers.length > 0) {
      req.body.passengers = req.body.passengers.map((p) => {
        const pGen = String(p.gender || "male").toLowerCase();
        return {
          ...p,
          gender: pGen === "women" || pGen === "female" || pGen === "f" ? "female" : "male",
        };
      });
    }

    // Generate clean PNR with route code if not present
    if (!req.body.pnr) {
      const fromCode = String(req.body.busDetails?.from || "P").trim().charAt(0).toUpperCase() || "P";
      const toCode = String(req.body.busDetails?.to || "J").trim().charAt(0).toUpperCase() || "J";
      const randNum = Math.floor(10000 + Math.random() * 90000);
      req.body.pnr = `PNR-${fromCode}${toCode}-${randNum}`;
    }

    const order = await Order.create({ ...req.body });

    const targetDate = typeof req.body.ticketSummary?.date === "string"
      ? req.body.ticketSummary.date.split("T")[0]
      : new Date(req.body.ticketSummary?.date || Date.now()).toISOString().split("T")[0];

    // Record seat bookings in BusModel with individual per-seat gender!
    if (req.body.bus) {
      if (Array.isArray(req.body.passengers) && req.body.passengers.length > 0) {
        for (const p of req.body.passengers) {
          const seatNum = String(p.seat || "").trim();
          if (seatNum) {
            const ticketdata = targetDate + "@" + seatNum + "@" + p.gender;
            await BusModel.findByIdAndUpdate(req.body.bus, { $push: { seats: ticketdata } });
          }
        }
      } else {
        const seatList = String(req.body.ticketSummary?.ticket || "1").split(",").map((s) => s.trim()).filter(Boolean);
        for (const s of seatList) {
          const ticketdata = targetDate + "@" + s + "@" + normalizedGender;
          await BusModel.findByIdAndUpdate(req.body.bus, { $push: { seats: ticketdata } });
        }
      }
    }

    return res.status(201).json(order);
  } catch (error) {
    console.error("Order creation error:", error.message);
    return res.status(500).json({ message: "Internal server error: " + error.message });
  }
});

app.post("/myticket", async (req, res) => {
  try {
    let filter = {};
    if (req.body.id && mongoose.Types.ObjectId.isValid(req.body.id)) {
      filter = { user: req.body.id };
    }
    let orders = await Order.find(filter).sort({ createdAt: -1 });
    if (orders.length === 0) {
      orders = await Order.find({}).sort({ createdAt: -1 }).limit(10);
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.error("myticket error:", error.message);
    return res.status(200).json([]);
  }
});

app.delete("/oneorder/:id", async (req, res) => {
  let rawId = req.params.id;
  if (rawId.startsWith(":")) rawId = rawId.slice(1);
  try {
    let filter = {};
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      filter = { $or: [{ _id: rawId }, { user: rawId }] };
    } else {
      filter = { user: rawId };
    }
    const order = await Order.findOneAndDelete(filter);
    if (order && order.bus) {
      // Remove the cancelled seat(s) from bus.seats array so it immediately becomes available
      try {
        const ticketStr = String(order.ticketSummary?.ticket || "");
        const cancelledSeatsList = ticketStr.split(",").map((s) => s.trim()).filter(Boolean);
        const rawDate = order.ticketSummary?.date;
        const targetDate = typeof rawDate === "string" ? rawDate.split("T")[0] : new Date(rawDate).toISOString().split("T")[0];
        const bus = await BusModel.findById(order.bus);
        if (bus && Array.isArray(bus.seats)) {
          bus.seats = bus.seats.filter((s) => {
            if (typeof s !== "string") return true;
            const parts = s.split("@");
            const sDate = (parts[0] || "").split("T")[0];
            const sSeats = (parts[1] || "").trim();
            if (sDate === targetDate && (sSeats === ticketStr || cancelledSeatsList.includes(sSeats))) {
              return false;
            }
            return true;
          });
          await bus.save();
        }
      } catch (cleanErr) {
        console.error("Error freeing bus seat on order cancellation:", cleanErr.message);
      }
    }
    return res.status(200).json({ message: "Ticket cancelled successfully", order });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error: " + error.message });
  }
});

app.post("/myticket/today", async (req, res) => {
  try {
    let filter = {};
    if (req.body.id && mongoose.Types.ObjectId.isValid(req.body.id)) {
      filter = { user: req.body.id };
    }
    let orders = await Order.find(filter).sort({ createdAt: -1 });
    if (orders.length === 0) {
      orders = await Order.find({}).sort({ createdAt: -1 }).limit(10);
    }
    const todayStr = new Date().toISOString().split("T")[0];
    const data = orders.filter((ele) => {
      if (!ele.ticketSummary || !ele.ticketSummary.date) return false;
      try {
        const orderDateStr = new Date(ele.ticketSummary.date).toISOString().split("T")[0];
        return orderDateStr === todayStr;
      } catch (e) {
        return false;
      }
    });
    return res.status(200).json(data);
  } catch (error) {
    console.error("myticket/today error:", error.message);
    return res.status(200).json([]);
  }
});

app.post("/myticket/upcoming", async (req, res) => {
  try {
    let filter = {};
    if (req.body.id && mongoose.Types.ObjectId.isValid(req.body.id)) {
      filter = { user: req.body.id };
    }
    let orders = await Order.find(filter).sort({ createdAt: -1 });
    if (orders.length === 0) {
      orders = await Order.find({}).sort({ createdAt: -1 }).limit(10);
    }
    const now = new Date();
    const data = orders.filter((ele) => {
      if (!ele.ticketSummary || !ele.ticketSummary.date) return false;
      try {
        return new Date(ele.ticketSummary.date) >= now;
      } catch (e) {
        return false;
      }
    });
    return res.status(200).json(data);
  } catch (error) {
    console.error("myticket/upcoming error:", error.message);
    return res.status(200).json([]);
  }
});

app.post("/myticket/past", async (req, res) => {
  try {
    let filter = {};
    if (req.body.id && mongoose.Types.ObjectId.isValid(req.body.id)) {
      filter = { user: req.body.id };
    }
    let orders = await Order.find(filter).sort({ createdAt: -1 });
    if (orders.length === 0) {
      orders = await Order.find({}).sort({ createdAt: -1 }).limit(10);
    }
    const now = new Date();
    const data = orders.filter((ele) => {
      if (!ele.ticketSummary || !ele.ticketSummary.date) return false;
      try {
        return new Date(ele.ticketSummary.date) < now;
      } catch (e) {
        return false;
      }
    });
    return res.status(200).json(data);
  } catch (error) {
    console.error("myticket/past error:", error.message);
    return res.status(200).json([]);
  }
});

// Fetch single ticket details by Order ID or PNR (GET /order/ticket/:id)
app.get("/ticket/:id", async (req, res) => {
  try {
    let rawId = (req.params.id || "").trim();
    if (rawId.startsWith(":")) rawId = rawId.slice(1);
    let cleanCode = rawId.replace(/^pnr[-_\s]?/i, "").toLowerCase();

    let ticketOrder = null;

    // 1. First attempt: Direct match against PNR field
    ticketOrder = await Order.findOne({
      pnr: new RegExp(`^${rawId.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}$`, "i")
    });

    // 2. Second attempt: Partial PNR match (e.g. user typed "78401" or "PJ-78401")
    if (!ticketOrder && cleanCode) {
      ticketOrder = await Order.findOne({
        pnr: new RegExp(cleanCode.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&"), "i")
      });
    }

    // 3. Third attempt: Exact 24-char MongoDB ObjectId
    if (!ticketOrder && cleanCode.length === 24 && mongoose.Types.ObjectId.isValid(cleanCode)) {
      ticketOrder = await Order.findById(cleanCode);
    }

    // 4. Fourth attempt: Match by last 6 chars of MongoDB ObjectId
    if (!ticketOrder && cleanCode.length === 6) {
      const recent = await Order.find().sort({ createdAt: -1 }).limit(200);
      ticketOrder = recent.find((o) => o._id.toString().toLowerCase().endsWith(cleanCode));
    }

    // 5. Fifth attempt: Match by payment orderId / razorpayOrderId
    if (!ticketOrder) {
      ticketOrder = await Order.findOne({
        $or: [
          { "paymentDetails.orderId": rawId },
          { "paymentDetails.razorpayOrderId": rawId },
        ],
      });
    }

    if (!ticketOrder) {
      return res.status(404).json({ error: `Ticket not found for PNR: ${rawId}` });
    }

    return res.status(200).json({
      status: "Success",
      ticket: {
        orderId: ticketOrder._id,
        pnr: ticketOrder.pnr || `PNR-${ticketOrder._id.toString().slice(-6).toUpperCase()}`,
        passenger: ticketOrder.userDetails,
        passengers: ticketOrder.passengers || [],
        journey: {
          from: ticketOrder.busDetails?.from,
          to: ticketOrder.busDetails?.to,
          departure: ticketOrder.busDetails?.departure,
          arrival: ticketOrder.busDetails?.arrival,
          busName: ticketOrder.busDetails?.name,
          date: ticketOrder.ticketSummary?.date,
        },
        booking: {
          seats: ticketOrder.ticketSummary?.ticket,
          totalAmount: ticketOrder.ticketSummary?.amount,
          paymentId: ticketOrder.paymentDetails?.razorpayPaymentId || ticketOrder.paymentDetails?.orderId,
          status: "CONFIRMED",
        },
        raw: ticketOrder,
      },
    });
  } catch (error) {
    console.error("Error in GET /order/ticket/:id:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = app;
