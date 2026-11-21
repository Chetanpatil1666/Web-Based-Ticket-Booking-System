const express = require("express");
const CityModel = require("../models/city.model");

const app = express.Router();

app.get("/", async (req, res) => {
  let data = await CityModel.find({}).sort({ name: 1 });
  res.send(data);
});

app.get("/stops/:cityName", async (req, res) => {
  try {
    const clean = (req.params.cityName || "").split(",")[0].trim();
    const city = await CityModel.findOne({
      name: { $regex: new RegExp(`^${clean.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")}$`, "i") },
    });
    if (!city) {
      return res.status(200).json({
        name: clean || "City",
        state: "India",
        boardingPoints: [
          { name: `${clean} Central ST Bus Stand`, landmark: "Main Terminus", offsetMin: 0 },
          { name: `${clean} Highway Bypass`, landmark: "NH Toll Exit", offsetMin: 15 },
        ],
        droppingPoints: [
          { name: `${clean} Highway Bypass`, landmark: "City Entry", offsetMin: -15 },
          { name: `${clean} Central Bus Terminus`, landmark: "Main Stand", offsetMin: 0 },
        ],
      });
    }
    return res.status(200).json(city);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/", async (req, res) => {
  try {
    const raw = req.body.destination !== undefined ? req.body.destination : req.body.source;
    const q = String(raw || "").trim().toUpperCase();

    let data = await CityModel.find().sort({ name: 1 });
    if (!q) {
      return res.send(data);
    }

    let city = data.filter((ele) => ele.name.toUpperCase().includes(q));
    city.sort((a, b) => {
      const aStarts = a.name.toUpperCase().startsWith(q) ? 0 : 1;
      const bStarts = b.name.toUpperCase().startsWith(q) ? 0 : 1;
      return aStarts - bStarts || a.name.localeCompare(b.name);
    });

    return res.send(city);
  } catch (error) {
    return res.send(error.message);
  }
});

app.post("/showcity", async (req, res) => {
  let sourceStr = (req.body.source || "").split(",")[0].trim();
  let destinationStr = (req.body.destination || "").split(",")[0].trim();
  try {
    if (!sourceStr || !destinationStr) {
      return res.send({ status: "failed", data: "Please enter both source and destination" });
    }
    let fromcheck = await CityModel.findOne({ name: { $regex: new RegExp(`^${sourceStr}$`, "i") } });
    let destinationcheck = await CityModel.findOne({ name: { $regex: new RegExp(`^${destinationStr}$`, "i") } });

    if (!fromcheck) {
      fromcheck = await CityModel.create({
        name: sourceStr.charAt(0).toUpperCase() + sourceStr.slice(1),
        state: "India",
      });
    }
    if (!destinationcheck) {
      destinationcheck = await CityModel.create({
        name: destinationStr.charAt(0).toUpperCase() + destinationStr.slice(1),
        state: "India",
      });
    }

    return res.send({ status: "success", data: "Buses In Your City Are Here" });
  } catch (error) {
    return res.send(error.message);
  }
});

module.exports = app;
