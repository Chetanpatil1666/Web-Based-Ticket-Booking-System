const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const reqString = { type: String, required: true, trim: true };

const orderSchema = new Schema(
  {
    busDetails: {
      name: reqString,
      from: reqString,
      to: reqString,
      contactemail: { type: String, default: "", trim: true },
      contactphone: { type: Schema.Types.Mixed, default: "" },
      arrival: reqString,
      departure: reqString,
      boardingPoint: { type: String, default: "", trim: true },
      droppingPoint: { type: String, default: "", trim: true },
    },
    pnr: { type: String, default: "" },

    ticketSummary: {
      date: { type: Date, required: true, default: Date.now },
      ticket: reqString,
      amount: { type: Schema.Types.Mixed, required: true },
    },
    paymentDetails: {
      orderId: reqString,
      razorpayOrderId: { type: String, default: "" },
      razorpayPaymentId: { type: String, default: "" },
    },
    userDetails: {
      name: reqString,
      age: { type: Schema.Types.Mixed, required: true },
      gender: { type: String, default: "male" },
      email: { type: String, required: true, trim: true, lowercase: true },
      phone: { type: Schema.Types.Mixed, required: true },
    },
    passengers: [
      {
        seat: { type: String, default: "" },
        berth: { type: String, default: "" },
        name: { type: String, default: "" },
        age: { type: Schema.Types.Mixed, default: "" },
        gender: { type: String, default: "male" },
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "userss",
      required: true,
    },
    bus: {
      type: Schema.Types.ObjectId,
      ref: "busses",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Explicitly bind to 'ordersses' collection and register aliases
const OrderModel = mongoose.models.orderss || model("orderss", orderSchema, "ordersses");

if (!mongoose.models.order) {
  model("order", orderSchema, "ordersses");
}

module.exports = OrderModel;
