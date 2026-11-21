const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const BusModel = require("../src/models/bus.model");

async function upgrade() {
  try {
    const mongoUri = process.env.MONGO_PATH || "mongodb://127.0.0.1:27017/newbus";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB:", mongoUri);

    const buses = await BusModel.find({});
    console.log(`Found ${buses.length} buses in database.`);

    for (const b of buses) {
      let changed = false;
      let name = (b.companyname || "").trim();

      // Normalize name
      if (name.toLowerCase() === "purpal") {
        b.companyname = "Purple Travels Premier Sleeper";
        b.departure = "20:00";
        b.arrival = "09:30";
        b.price = 1550;
        b.rating = 4.6;
        b.aminites = ["AC", "SLEEPER", "Charging Point", "WiFi", "Water Bottle", "Blanket", "Live Tracking"];
        changed = true;
      } else if (name.toLowerCase() === "neeta" && b.price >= 4000) {
        b.companyname = "Neeta Tours & Travels Volvo Multi-Axle";
        b.departure = "21:30";
        b.arrival = "10:45";
        b.price = 1650;
        b.rating = 4.5;
        b.aminites = ["AC", "SLEEPER", "Charging Point", "WiFi", "Emergency SOS"];
        changed = true;
      } else if (name.toLowerCase() === "durga") {
        b.companyname = "Durga Deluxe Superfast Express";
        b.departure = "18:30";
        b.arrival = "07:45";
        b.price = 1150;
        b.rating = 4.3;
        b.aminites = ["AC", "SEATER", "Charging Point", "Water Bottle"];
        changed = true;
      } else if (name.toLowerCase() === "volvo") {
        b.companyname = "Kallada Travels Volvo Multi-Axle";
        b.departure = "21:00";
        b.arrival = "10:15";
        b.price = 1750;
        b.rating = 4.7;
        b.aminites = ["AC", "SLEEPER", "Charging Point", "WiFi", "Blanket", "Emergency SOS"];
        changed = true;
      } else if (name.toLowerCase() === "durgesh") {
        b.companyname = "SRS Travels Royal Class";
        b.departure = "19:45";
        b.arrival = "09:00";
        b.price = 1480;
        b.rating = 4.5;
        b.aminites = ["AC", "SLEEPER", "Charging Point", "WiFi", "Live Tracking"];
        changed = true;
      }

      // Check single digit or plain hour departure/arrival
      if (b.departure && !b.departure.includes(":")) {
        const h = parseInt(b.departure, 10);
        b.departure = isNaN(h) ? "21:00" : (h < 10 ? `0${h}:00` : `${h}:00`);
        changed = true;
      }
      if (b.arrival && !b.arrival.includes(":")) {
        const h = parseInt(b.arrival, 10);
        b.arrival = isNaN(h) ? "08:00" : (h < 10 ? `0${h}:00` : `${h}:00`);
        changed = true;
      }

      // Enrich amenities if minimal
      if (!b.aminites || b.aminites.length <= 2) {
        const base = Array.isArray(b.aminites) ? [...b.aminites] : ["AC", "SLEEPER"];
        const extra = ["Charging Point", "Live Tracking", "Emergency SOS", "Water Bottle"];
        extra.forEach((item) => {
          if (!base.includes(item)) base.push(item);
        });
        b.aminites = base;
        changed = true;
      }

      // Clean invalid seats entries (e.g. containing '@{name=')
      if (Array.isArray(b.seats) && b.seats.some(s => typeof s === "string" && s.includes("@{"))) {
        b.seats = b.seats.filter(s => typeof s === "string" && !s.includes("@{"));
        changed = true;
      }

      if (changed) {
        await b.save();
        console.log(`Updated bus: ${b.companyname} (${b.from} -> ${b.to})`);
      }
    }

    console.log("Upgrade complete!");
    process.exit(0);
  } catch (err) {
    console.error("Upgrade error:", err);
    process.exit(1);
  }
}

upgrade();

