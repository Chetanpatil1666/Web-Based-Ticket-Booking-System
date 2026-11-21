const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const StopSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    landmark: { type: String, default: "", trim: true },
    offsetMin: { type: Number, default: 0 },
  },
  { _id: false }
);

const CitySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    boardingPoints: { type: [StopSchema], default: [] },
    droppingPoints: { type: [StopSchema], default: [] },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Explicitly bind to 'cities' collection and register 'city' alias
const CityModel = mongoose.models.cities || model("cities", CitySchema, "cities");

if (!mongoose.models.city) {
  model("city", CitySchema, "cities");
}

module.exports = CityModel;
