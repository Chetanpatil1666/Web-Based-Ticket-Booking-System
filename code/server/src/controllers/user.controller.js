const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const UserModel = require("../models/user.model");

const app = express.Router();

const escapeRegex = (text) => (text || "").replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

// Register / Sign Up
app.post("/signup", async (req, res) => {
  let email = (req.body.email || "").trim().toLowerCase();
  let password = (req.body.password || "").trim();
  let rawGender = (req.body.gender || "male").trim().toLowerCase();
  let name = (req.body.name || "").trim();

  const gender =
    rawGender === "female" || rawGender === "women" || rawGender === "f"
      ? "female"
      : "male";

  if (!email || !password) {
    return res.send({
      status: "Failed",
      message: "Please provide both email and password",
    });
  }

  // Basic email pattern check
  if (!email.includes("@") || !email.includes(".")) {
    return res.send({
      status: "Failed",
      message: "Please enter a valid email address",
    });
  }

  if (password.length < 4) {
    return res.send({
      status: "Failed",
      message: "Password must be at least 4 characters long",
    });
  }

  try {
    const emailRegex = new RegExp(`^${escapeRegex(email)}$`, "i");

    // Check if user already exists in main collection
    let user = await UserModel.findOne({ email: { $regex: emailRegex } });

    // Also check legacy collection if any
    if (!user) {
      const legacyUser = await mongoose.connection.collection("userss").findOne({
        email: { $regex: emailRegex },
      });
      if (legacyUser) user = legacyUser;
    }

    if (user) {
      return res.send({
        status: "Failed",
        message: "Email is already registered. Please sign in instead.",
      });
    }

    // Create new user
    const newUser = await UserModel.create({
      email,
      password,
      gender,
      name: name || email.split("@")[0],
    });

    const jwtSecret = process.env.JWT_SECRET || "1234";
    // Generate JWT Token valid for 7 days for seamless auto-login
    const token = jwt.sign({ user: newUser }, jwtSecret, { expiresIn: "7d" });

    return res.send({
      status: "Success",
      message: "Signup Successful! Welcome to BlueBus.",
      token,
      user: {
        _id: newUser._id,
        email: newUser.email,
        gender: newUser.gender,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    return res.send({ message: error.message, status: "Failed" });
  }
});

// Login / Sign In
app.post("/login", async (req, res) => {
  let email = (req.body.email || "").trim().toLowerCase();
  let password = (req.body.password || "").trim();

  if (!email || !password) {
    return res.send({
      status: "Failed",
      message: "Please enter your email and password",
    });
  }

  try {
    const emailRegex = new RegExp(`^${escapeRegex(email)}$`, "i");

    // 1. Look in main collection
    let user = await UserModel.findOne({ email: { $regex: emailRegex } });

    // 2. Fallback to legacy collection and migrate on the fly
    if (!user) {
      const legacyUser = await mongoose.connection.collection("userss").findOne({
        email: { $regex: emailRegex },
      });
      if (legacyUser) {
        user = await UserModel.create({
          email: legacyUser.email.toLowerCase().trim(),
          password: legacyUser.password,
          gender: legacyUser.gender || "male",
        });
      }
    }

    if (!user) {
      return res.send({
        status: "Failed",
        message: "Account not found. Please check your email or Sign Up.",
      });
    }

    if (user.password !== password) {
      return res.send({
        status: "Failed",
        message: "Incorrect password. Please try again.",
      });
    }

    const jwtSecret = process.env.JWT_SECRET || "1234";
    // Generate JWT Token (valid for 7 days)
    const token = jwt.sign({ user }, jwtSecret, { expiresIn: "7d" });

    return res.send({
      status: "Success",
      message: {
        token,
        user: {
          _id: user._id,
          email: user.email,
          gender: user.gender || "male",
          name: user.name || "",
        },
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.send({ message: error.message, status: "Failed" });
  }
});

const OrderModel = require("../models/order.model");

// Get user profile + booking stats (GET /user/profile/:id)
app.get("/profile/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }
    let user = await UserModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const totalOrders = await OrderModel.countDocuments({ user: id });
    return res.status(200).json({
      status: "Success",
      user,
      stats: {
        totalBookings: totalOrders,
      },
    });
  } catch (error) {
    console.error("Error in GET /user/profile/:id:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

// Update user profile (PUT /user/profile/:id)
app.put("/profile/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }
    const updates = {};
    if (req.body.name !== undefined) updates.name = String(req.body.name).trim();
    if (req.body.gender !== undefined) updates.gender = String(req.body.gender).trim();
    if (req.body.phone !== undefined) updates.phone = req.body.phone;
    if (req.body.password !== undefined && String(req.body.password).trim() !== "") {
      updates.password = String(req.body.password).trim();
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updates, { new: true }).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({
      status: "Success",
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in PUT /user/profile/:id:", error.message);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = app;
