const express = require("express");
const mongoose = require("mongoose");
const BusModel = require("../models/bus.model");
const OrderModel = require("../models/order.model");

const app = express.Router();

// Helper function to safely escape regex special characters
const escapeRegex = (text) => (text || "").replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

// Add a new bus
app.post("/addnew", async (req, res) => {
  try {
    let newbus = await BusModel.create({ ...req.body });
    return res.status(201).send(newbus);
  } catch (error) {
    console.error("Error adding bus:", error.message);
    return res.status(500).send({ error: error.message });
  }
});

// Generates a comprehensive, realistic fleet of 16 scheduled buses covering all time slots, bus types, and price points
function generateFleet(fromCap, toCap) {
  return [
    {
      companyname: "IntrCity SmartBus",
      from: fromCap,
      to: toCap,
      price: 1850,
      email: "help@intrcity.com",
      phone: 9910099100,
      aminites: ["AC", "SLEEPER"],
      rating: 4.8,
      arrival: "06:00",
      departure: "23:30",
      seats: [],
    },
    {
      companyname: "Orange Travels Gold Class",
      from: fromCap,
      to: toCap,
      price: 1600,
      email: "support@orangetravels.com",
      phone: 9820011223,
      aminites: ["AC", "SLEEPER"],
      rating: 4.7,
      arrival: "04:30",
      departure: "21:00",
      seats: [],
    },
    {
      companyname: "VRL Travels I-Shift",
      from: fromCap,
      to: toCap,
      price: 1550,
      email: "care@vrltravels.com",
      phone: 9845012345,
      aminites: ["AC", "SLEEPER"],
      rating: 4.6,
      arrival: "05:45",
      departure: "22:15",
      seats: [],
    },
    {
      companyname: "Zingbus Electric Plus",
      from: fromCap,
      to: toCap,
      price: 750,
      email: "support@zingbus.com",
      phone: 9811223344,
      aminites: ["AC", "SEATER"],
      rating: 4.7,
      arrival: "11:30",
      departure: "07:00",
      seats: [],
    },
    {
      companyname: "SRS Travels Volvo Multi-Axle",
      from: fromCap,
      to: toCap,
      price: 1400,
      email: "booking@srstravels.com",
      phone: 9844011223,
      aminites: ["AC", "SLEEPER"],
      rating: 4.4,
      arrival: "03:45",
      departure: "20:30",
      seats: [],
    },
    {
      companyname: "Neeta Tours and Travels",
      from: fromCap,
      to: toCap,
      price: 650,
      email: "info@neetabus.com",
      phone: 9822098220,
      aminites: ["AC", "SEATER"],
      rating: 4.3,
      arrival: "13:00",
      departure: "08:30",
      seats: [],
    },
    {
      companyname: "Hans Travels Executive",
      from: fromCap,
      to: toCap,
      price: 950,
      email: "help@hanstravels.com",
      phone: 9826012345,
      aminites: ["NONAC", "SLEEPER"],
      rating: 4.2,
      arrival: "03:00",
      departure: "19:45",
      seats: [],
    },
    {
      companyname: "Chartered Bus Speedster",
      from: fromCap,
      to: toCap,
      price: 800,
      email: "care@charteredbus.in",
      phone: 9827011223,
      aminites: ["AC", "SEATER"],
      rating: 4.5,
      arrival: "18:30",
      departure: "14:00",
      seats: [],
    },
    {
      companyname: "Paulo Travels Royal Cruiser",
      from: fromCap,
      to: toCap,
      price: 1450,
      email: "booking@paulotravels.com",
      phone: 9823011223,
      aminites: ["AC", "SLEEPER"],
      rating: 4.4,
      arrival: "01:30",
      departure: "18:15",
      seats: [],
    },
    {
      companyname: "Konduskar Travels",
      from: fromCap,
      to: toCap,
      price: 850,
      email: "info@konduskar.com",
      phone: 9822112233,
      aminites: ["NONAC", "SLEEPER"],
      rating: 4.1,
      arrival: "06:15",
      departure: "22:45",
      seats: [],
    },
    {
      companyname: "Gujarat Travels Premium",
      from: fromCap,
      to: toCap,
      price: 1300,
      email: "contact@gujarattravels.com",
      phone: 9825012345,
      aminites: ["AC", "SLEEPER"],
      rating: 4.3,
      arrival: "23:00",
      departure: "16:30",
      seats: [],
    },
    {
      companyname: "Shivshahi Express (MSRTC)",
      from: fromCap,
      to: toCap,
      price: 550,
      email: "support@msrtc.gov.in",
      phone: 9820198201,
      aminites: ["AC", "SEATER"],
      rating: 4.2,
      arrival: "09:45",
      departure: "05:15",
      seats: [],
    },
    {
      companyname: "Sharma Transports Deluxe",
      from: fromCap,
      to: toCap,
      price: 450,
      email: "care@sharmatransports.com",
      phone: 9845098450,
      aminites: ["NONAC", "SEATER"],
      rating: 4.0,
      arrival: "16:00",
      departure: "11:15",
      seats: [],
    },
    {
      companyname: "National Travels Grand",
      from: fromCap,
      to: toCap,
      price: 700,
      email: "support@nationaltravels.com",
      phone: 9880011223,
      aminites: ["AC", "SEATER"],
      rating: 4.3,
      arrival: "22:00",
      departure: "17:30",
      seats: [],
    },
    {
      companyname: "Dolphin Travel House",
      from: fromCap,
      to: toCap,
      price: 1250,
      email: "help@dolphintravels.com",
      phone: 9820098200,
      aminites: ["AC", "SLEEPER"],
      rating: 4.4,
      arrival: "10:00",
      departure: "04:30",
      seats: [],
    },
    {
      companyname: "Mahasagar Travels Superfast",
      from: fromCap,
      to: toCap,
      price: 480,
      email: "contact@mahasagartravels.com",
      phone: 9824012345,
      aminites: ["NONAC", "SEATER"],
      rating: 4.1,
      arrival: "17:30",
      departure: "12:45",
      seats: [],
    },
  ];
}

// Search buses by route (POST)
app.post("/getall", async (req, res) => {
  try {
    let sourceStr = (req.body.from || "").split(",")[0].trim();
    let destinationStr = (req.body.to || "").split(",")[0].trim();

    // If source or destination is empty, return empty list cleanly
    if (!sourceStr || !destinationStr) {
      return res.send([]);
    }

    const fromRegex = new RegExp(`^${escapeRegex(sourceStr)}$`, "i");
    const toRegex = new RegExp(`^${escapeRegex(destinationStr)}$`, "i");

    let allbusses = await BusModel.find({
      from: { $regex: fromRegex },
      to: { $regex: toRegex },
    });

    // Ensure at least 15 comprehensive scheduled buses for this route across all times & categories
    if (allbusses.length < 15 && sourceStr.toLowerCase() !== destinationStr.toLowerCase()) {
      let fromCap = sourceStr.charAt(0).toUpperCase() + sourceStr.slice(1);
      let toCap = destinationStr.charAt(0).toUpperCase() + destinationStr.slice(1);

      const existingNames = new Set(allbusses.map((b) => b.companyname.toLowerCase().trim()));
      const fleet = generateFleet(fromCap, toCap);
      const toInsert = fleet.filter((b) => !existingNames.has(b.companyname.toLowerCase().trim()));

      if (toInsert.length > 0) {
        await BusModel.insertMany(toInsert);
        allbusses = await BusModel.find({
          from: { $regex: fromRegex },
          to: { $regex: toRegex },
        });
      }
    }

    return res.send(allbusses);
  } catch (error) {
    console.error("Error in /getall:", error.message);
    return res.send([]);
  }
});

// Also support GET for /getall via query parameters
app.get("/getall", async (req, res) => {
  try {
    let sourceStr = (req.query.from || "").split(",")[0].trim();
    let destinationStr = (req.query.to || "").split(",")[0].trim();

    if (!sourceStr || !destinationStr) {
      let all = await BusModel.find({});
      return res.send(all);
    }

    const fromRegex = new RegExp(`^${escapeRegex(sourceStr)}$`, "i");
    const toRegex = new RegExp(`^${escapeRegex(destinationStr)}$`, "i");

    let allbusses = await BusModel.find({
      from: { $regex: fromRegex },
      to: { $regex: toRegex },
    });

    // Ensure at least 15 comprehensive scheduled buses for this route
    if (allbusses.length < 15 && sourceStr.toLowerCase() !== destinationStr.toLowerCase()) {
      let fromCap = sourceStr.charAt(0).toUpperCase() + sourceStr.slice(1);
      let toCap = destinationStr.charAt(0).toUpperCase() + destinationStr.slice(1);

      const existingNames = new Set(allbusses.map((b) => b.companyname.toLowerCase().trim()));
      const fleet = generateFleet(fromCap, toCap);
      const toInsert = fleet.filter((b) => !existingNames.has(b.companyname.toLowerCase().trim()));

      if (toInsert.length > 0) {
        await BusModel.insertMany(toInsert);
        allbusses = await BusModel.find({
          from: { $regex: fromRegex },
          to: { $regex: toRegex },
        });
      }
    }

    return res.send(allbusses);
  } catch (error) {
    console.error("Error in GET /getall:", error.message);
    return res.send([]);
  }
});

// Fetch a single bus by ID and return its booked seats for the specified date
app.post("/one", async (req, res) => {
  try {
    const id = req.body.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.send([]);
    }
    let bus = await BusModel.findById(id);
    if (!bus) return res.send([]);

    const busObj = bus.toObject();
    const targetDate = (req.body.date || "").split("T")[0];

    // Find all confirmed orders for this bus on this date from Order collection
    let orderFilter = { bus: id };
    if (targetDate) {
      const startOfDay = new Date(targetDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(targetDate);
      endOfDay.setUTCHours(23, 59, 59, 999);
      orderFilter["ticketSummary.date"] = { $gte: startOfDay, $lte: endOfDay };
    }
    const orders = await OrderModel.find(orderFilter);

    // Collect all booked seats and their corresponding passenger gender
    const bookedSeatsSet = new Set();
    const bookedSeatsGender = {}; // { [seatNumber]: "male" | "female" }

    orders.forEach((o) => {
      // If order contains individual passenger records per seat, map each seat to its passenger's gender!
      if (Array.isArray(o.passengers) && o.passengers.length > 0) {
        o.passengers.forEach((p) => {
          const seatNum = String(p.seat || "").trim();
          if (seatNum) {
            bookedSeatsSet.add(seatNum);
            const pGen = String(p.gender || "male").toLowerCase();
            bookedSeatsGender[seatNum] =
              pGen === "women" || pGen === "female" || pGen === "f" ? "female" : "male";
          }
        });
      } else {
        const rawGender = String(o.userDetails?.gender || "male").toLowerCase();
        const normalizedGender =
          rawGender === "women" || rawGender === "female" || rawGender === "f"
            ? "female"
            : "male";

        const t = String(o.ticketSummary?.ticket || "");
        t.split(",").forEach((s) => {
          const trimmed = s.trim();
          if (trimmed) {
            bookedSeatsSet.add(trimmed);
            bookedSeatsGender[trimmed] = normalizedGender;
          }
        });
      }
    });

    // Also check bus.seats array
    (busObj.seats || []).forEach((ele) => {
      if (typeof ele === "string") {
        const parts = ele.split("@");
        const sDate = (parts[0] || "").split("T")[0];
        if (!targetDate || sDate === targetDate) {
          const rawGender = String(parts[2] || "male").toLowerCase();
          const normalizedGender =
            rawGender === "women" || rawGender === "female" || rawGender === "f"
              ? "female"
              : "male";

          (parts[1] || "").split(",").forEach((s) => {
            const trimmed = s.trim();
            if (trimmed) {
              bookedSeatsSet.add(trimmed);
              if (!bookedSeatsGender[trimmed]) {
                bookedSeatsGender[trimmed] = normalizedGender;
              }
            }
          });
        }
      }
    });

    busObj.bookedSeatsList = Array.from(bookedSeatsSet);
    busObj.bookedSeatsGender = bookedSeatsGender;
    return res.send([busObj]);
  } catch (error) {
    console.error("Error in POST /one:", error.message);
    return res.send([]);
  }
});

// Fetch single bus by ID (GET)
app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send({ message: "Bus not found" });
    }
    let bus = await BusModel.findById(id);
    if (!bus) return res.status(404).send({ message: "Bus not found" });
    return res.send([bus]);
  } catch (error) {
    console.error("Error in GET /:id:", error.message);
    return res.status(500).send({ error: error.message });
  }
});

// Update a bus by ID (PUT /bus/:id)
app.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid Bus ID" });
    }
    const updatedBus = await BusModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBus) {
      return res.status(404).send({ error: "Bus not found" });
    }
    return res.status(200).send({ message: "Bus updated successfully", bus: updatedBus });
  } catch (error) {
    console.error("Error in PUT /:id:", error.message);
    return res.status(500).send({ error: error.message });
  }
});

// Delete a bus by ID (DELETE /bus/:id)
app.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send({ error: "Invalid Bus ID" });
    }
    const deletedBus = await BusModel.findByIdAndDelete(id);
    if (!deletedBus) {
      return res.status(404).send({ error: "Bus not found" });
    }
    return res.status(200).send({ message: "Bus deleted successfully", bus: deletedBus });
  } catch (error) {
    console.error("Error in DELETE /:id:", error.message);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = app;
