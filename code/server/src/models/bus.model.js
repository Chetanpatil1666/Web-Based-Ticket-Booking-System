const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const BusSchema = new Schema(
  {
    companyname: { type: String, required: true, trim: true },
    from: { type: String, required: true, trim: true },
    to: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 1000 },
    email: { type: String, default: "", trim: true, lowercase: true },
    phone: { type: Schema.Types.Mixed, default: "" },
    aminites: { type: Array, default: ["AC", "SEATER", "WiFi", "Water Bottle"] },
    rating: { type: Number, default: 4.0 },
    arrival: { type: String, default: "08:00", trim: true },
    departure: { type: String, default: "21:00", trim: true },
    seats: { type: Array, default: [] },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Explicitly bind to 'busses' collection and register 'bus' alias for populate compatibility
const BusModel = mongoose.models.busses || model("busses", BusSchema, "busses");

if (!mongoose.models.bus) {
  model("bus", BusSchema, "busses");
}

module.exports = BusModel;
