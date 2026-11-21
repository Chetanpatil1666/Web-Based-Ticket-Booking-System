require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;

const cityRouter = require("./src/controllers/city.controller");
const busRouter = require("./src/controllers/bus.controller");
const userRouter=require("./src/controllers/user.controller");
const orderRouter=require("./src/controllers/order.controller")
const paymentController = require('./src/controllers/payment.controller');
const aiRouter = require('./src/controllers/ai.controller');

const connect = require("./src/configs/db");

app.use(cors());
app.use(express.json());

// Health check endpoints for cloud deployment platforms (Render, Railway, AWS, etc.)
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", service: "BlueBus Express API", port });
});
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    dbState: mongoose.connection.readyState === 1 ? "connected" : "connecting",
    uptimeSeconds: Math.round(process.uptime()),
  });
});

app.use("/user",userRouter)
app.use("/city", cityRouter);
app.use("/bus", busRouter);
app.use("/order", orderRouter);
app.use("/ai", aiRouter);

//Razorpay payment
app.use("/api/payment", paymentController);

const UserModel = require("./src/models/user.model");

async function ensureInitialData() {
  try {
    const cityCol = mongoose.connection.collection("cities");
    const count = await cityCol.countDocuments();
    if (count === 0) {
      const citiesPath = path.join(__dirname, "cities.json");
      if (fs.existsSync(citiesPath)) {
        const citiesData = JSON.parse(fs.readFileSync(citiesPath, "utf8"));
        const docs = citiesData.map((c) => ({
          name: c.name,
          state: c.state,
          boardingPoints: c.boardingPoints || [],
          droppingPoints: c.droppingPoints || [],
        }));
        if (docs.length > 0) {
          await cityCol.insertMany(docs);
          console.log(`Seeded ${docs.length} initial cities for fresh deployment.`);
        }
      }
    }

    // Ensure default demo user exists for immediate login in production
    const existingUser = await UserModel.findOne({ email: "demo@gmail.com" });
    if (!existingUser) {
      await UserModel.create({
        email: "demo@gmail.com",
        password: "password123",
        gender: "male",
        name: "Demo Traveler",
      });
      console.log("Seeded demo user: demo@gmail.com / password123");
    }
  } catch (err) {
    console.log("Initial data auto-seed note:", err.message);
  }
}

app.listen(port, async () => {
  try {
    await connect();
    await ensureInitialData();
    console.log(`listening on http://localhost:${port}`);
  } catch (error) {
    console.log(error.message);
  }
});
