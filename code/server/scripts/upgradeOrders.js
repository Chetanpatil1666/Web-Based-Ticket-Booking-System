const mongoose = require("mongoose");
const path = require("path");

const mongoUri = "mongodb://127.0.0.1:27017/newbus";

async function upgradeAllOrders() {
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB:", mongoUri);

  const Bus = require("../src/models/bus.model");
  const Order = require("../src/models/order.model");

  // Find all Pune -> Jalgaon buses to link to
  const pjBuses = await Bus.find({ from: /pune/i, to: /jalgaon/i });
  console.log(`Found ${pjBuses.length} Pune -> Jalgaon buses in database.`);

  const orders = await Order.find({});
  console.log(`Found ${orders.length} orders to upgrade to Pune -> Jalgaon.`);

  const sampleConfigs = [
    {
      operator: "IntrCity SmartBus",
      departure: "23:30",
      arrival: "06:00",
      amount: 1850,
      passenger: "Pooja Sharma",
      gender: "female",
      age: 24,
      seat: "6",
    },
    {
      operator: "IntrCity SmartBus",
      departure: "23:30",
      arrival: "06:00",
      amount: 1850,
      passenger: "Raju Rastogi",
      gender: "male",
      age: 27,
      seat: "1",
    },
    {
      operator: "Orange Travels Gold Class",
      departure: "21:00",
      arrival: "04:30",
      amount: 1600,
      passenger: "Sneha Jain",
      gender: "female",
      age: 26,
      seat: "3",
    },
    {
      operator: "VRL Travels I-Shift Sleeper",
      departure: "22:15",
      arrival: "05:45",
      amount: 1550,
      passenger: "Samay Raina",
      gender: "male",
      age: 29,
      seat: "4",
    },
    {
      operator: "SRS Travels Volvo Multi-Axle",
      departure: "20:30",
      arrival: "03:45",
      amount: 1400,
      passenger: "Kunal Mehra",
      gender: "male",
      age: 31,
      seat: "5",
    },
    {
      operator: "Neeta Tours and Travels",
      departure: "08:30",
      arrival: "13:00",
      amount: 650,
      passenger: "Sunita Roy",
      gender: "female",
      age: 28,
      seat: "2",
    },
    {
      operator: "Paulo Travels Royal Cruiser",
      departure: "18:15",
      arrival: "01:30",
      amount: 1450,
      passenger: "Jay Hindu",
      gender: "male",
      age: 25,
      seat: "7",
    },
    {
      operator: "Konduskar Travels Multi-Axle",
      departure: "22:45",
      arrival: "06:15",
      amount: 850,
      passenger: "Vikram Jadhav",
      gender: "male",
      age: 33,
      seat: "8",
    },
    {
      operator: "Gujarat Travels Premium Sleeper",
      departure: "16:30",
      arrival: "23:00",
      amount: 1300,
      passenger: "Ananya Deshmukh",
      gender: "female",
      age: 23,
      seat: "9",
    },
    {
      operator: "IntrCity SmartBus Premier",
      departure: "23:30",
      arrival: "06:00",
      amount: 1850,
      passenger: "Amit Verma",
      gender: "male",
      age: 30,
      seat: "10",
    },
    {
      operator: "Zingbus Electric Plus Sleeper",
      departure: "07:00",
      arrival: "11:30",
      amount: 750,
      passenger: "Rajesh Shinde",
      gender: "male",
      age: 35,
      seat: "11",
    },
  ];

  for (let i = 0; i < orders.length; i++) {
    const o = orders[i];
    const cfg = sampleConfigs[i % sampleConfigs.length];

    // Find a matching Pune -> Jalgaon bus
    const matchedBus = pjBuses.find(b => b.companyname && b.companyname.toLowerCase().includes(cfg.operator.split(" ")[0].toLowerCase())) || pjBuses[0];

    o.bus = matchedBus._id;
    o.busDetails = {
      name: cfg.operator,
      from: "Pune",
      to: "Jalgaon",
      contactemail: "support@smartbus.in",
      contactphone: "9820011223",
      departure: cfg.departure,
      arrival: cfg.arrival,
    };

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + (i % 5));
    o.ticketSummary = {
      date: targetDate,
      ticket: String(cfg.seat),
      amount: cfg.amount,
    };

    o.userDetails = {
      name: cfg.passenger,
      age: cfg.age,
      gender: cfg.gender,
      email: `${cfg.passenger.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      phone: "9820011223",
    };

    o.passengers = [
      {
        seat: String(cfg.seat),
        name: cfg.passenger,
        age: cfg.age,
        gender: cfg.gender,
      },
    ];

    await o.save();
    console.log(`[UPDATED] Order #${i + 1} (${o._id}): ${cfg.operator} | Pune -> Jalgaon (${cfg.departure} -> ${cfg.arrival}) | Passenger: ${cfg.passenger} (Seat ${cfg.seat})`);
  }

  console.log("\nALL ORDERS SUCCESSFULLY UPDATED TO PUNE -> JALGAON WITH CLASSIC PROFESSIONAL DATA!");
  process.exit(0);
}

upgradeAllOrders().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});

