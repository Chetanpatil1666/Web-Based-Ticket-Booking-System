require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

async function seed() {
  const mongoUri =
    process.env.MONGO_PATH ||
    process.env.MONGO_URL ||
    process.env.MONGODB_URL ||
    process.env.DATABASE_URL ||
    "mongodb://127.0.0.1:27017/newbus";
  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB:", mongoUri);

  // 1. Seed demo user
  const UserModel = require("./src/models/user.model");
  let existingUser = await UserModel.findOne({ email: "demo@gmail.com" });
  if (!existingUser) {
    await UserModel.create({ email: "demo@gmail.com", password: "password123", gender: "male" });
    console.log("Demo user created: demo@gmail.com / password123");
  } else {
    existingUser.password = "password123";
    await existingUser.save();
    console.log("Demo user password updated to password123");
  }

  // 2. Ensure all cities from cities.json exist
  const cityCol = mongoose.connection.collection("cities");
  const citiesData = JSON.parse(fs.readFileSync(path.join(__dirname, "cities.json"), "utf8"));
  for (const c of citiesData) {
    const exists = await cityCol.findOne({ name: { $regex: new RegExp("^" + c.name + "$", "i") } });
    if (!exists) {
      await cityCol.insertOne({ name: c.name, state: c.state });
      console.log("Inserted city:", c.name);
    }
  }

  // 3. Ensure busses from busses.json exist
  const busCol = mongoose.connection.collection("busses");
  const bussesData = JSON.parse(fs.readFileSync(path.join(__dirname, "busses.json"), "utf8"));
  for (const b of bussesData) {
    const exists = await busCol.findOne({ companyname: b.companyname, from: b.from, to: b.to });
    if (!exists) {
      delete b._id;
      await busCol.insertOne(b);
      console.log("Inserted bus:", b.companyname, b.from, "->", b.to);
    }
  }

  // 4. Ensure return routes & popular inter-city routes exist
  const extraRoutes = [
    // Pune <-> Mumbai
    { companyname: "Gunjan Travels", from: "Pune", to: "Mumbai", price: 3000, email: "gunjan@gmail.com", phone: 9309064219, aminites: ["AC", "SLEEPER"], rating: 4.2, arrival: "10", departure: "8", seats: [] },
    { companyname: "Manish Travels", from: "Pune", to: "Mumbai", price: 2800, email: "manish@gmail.com", phone: 9309064219, aminites: ["NONAC", "SEATER"], rating: 3.9, arrival: "14", departure: "12", seats: [] },
    { companyname: "Purple Travels", from: "Mumbai", to: "Pune", price: 2500, email: "purple@gmail.com", phone: 9309064220, aminites: ["AC", "SEATER"], rating: 4.4, arrival: "11", departure: "7", seats: [] },

    // Bengaluru <-> Mumbai
    { companyname: "Neeta Travels", from: "Bengaluru", to: "Mumbai", price: 4800, email: "neeta@gmail.com", phone: 9820098200, aminites: ["AC", "SLEEPER"], rating: 4.5, arrival: "20", departure: "7", seats: [] },
    { companyname: "Volvo Travels", from: "Bengaluru", to: "Mumbai", price: 5500, email: "volvo@gmail.com", phone: 9820098200, aminites: ["AC", "SLEEPER"], rating: 4.8, arrival: "22", departure: "6", seats: [] },

    // Pune <-> Jalgaon
    { companyname: "Sangitam Travels", from: "Pune", to: "Jalgaon", price: 1500, email: "sangitam@gmail.com", phone: 9422294222, aminites: ["AC", "SEATER"], rating: 4.0, arrival: "18", departure: "10", seats: [] },
    { companyname: "Akanksha Travels", from: "Jalgaon", to: "Pune", price: 1400, email: "akanksha@gmail.com", phone: 9422294223, aminites: ["AC", "SLEEPER"], rating: 4.1, arrival: "19", departure: "11", seats: [] },

    // Mumbai <-> Surat
    { companyname: "Gujarat Travels", from: "Mumbai", to: "Surat", price: 1800, email: "gujarat@gmail.com", phone: 9825098250, aminites: ["AC", "SEATER"], rating: 4.1, arrival: "12", departure: "6", seats: [] },
    { companyname: "Gujarat Travels", from: "Surat", to: "Mumbai", price: 1800, email: "gujarat@gmail.com", phone: 9825098250, aminites: ["AC", "SEATER"], rating: 4.1, arrival: "19", departure: "13", seats: [] },
    { companyname: "Shreenath Travels", from: "Mumbai", to: "Surat", price: 1600, email: "shreenath@gmail.com", phone: 9825098251, aminites: ["NONAC", "SLEEPER"], rating: 4.0, arrival: "14", departure: "8", seats: [] },
    { companyname: "Shreenath Travels", from: "Surat", to: "Mumbai", price: 1600, email: "shreenath@gmail.com", phone: 9825098251, aminites: ["NONAC", "SLEEPER"], rating: 4.0, arrival: "20", departure: "14", seats: [] },

    // Delhi <-> Jaipur
    { companyname: "Goldline Travels", from: "Delhi", to: "Jaipur", price: 1200, email: "goldline@gmail.com", phone: 9811098110, aminites: ["AC", "SEATER"], rating: 4.3, arrival: "11", departure: "6", seats: [] },
    { companyname: "Goldline Travels", from: "Jaipur", to: "Delhi", price: 1200, email: "goldline@gmail.com", phone: 9811098110, aminites: ["AC", "SEATER"], rating: 4.3, arrival: "18", departure: "13", seats: [] },
    { companyname: "Zingbus", from: "Delhi", to: "Jaipur", price: 999, email: "support@zingbus.com", phone: 9811098111, aminites: ["AC", "SLEEPER"], rating: 4.6, arrival: "12", departure: "7", seats: [] },
    { companyname: "Zingbus", from: "Jaipur", to: "Delhi", price: 999, email: "support@zingbus.com", phone: 9811098111, aminites: ["AC", "SLEEPER"], rating: 4.6, arrival: "19", departure: "14", seats: [] },

    // Mumbai <-> Ahmedabad
    { companyname: "Patel Tours", from: "Mumbai", to: "Ahmedabad", price: 2200, email: "patel@gmail.com", phone: 9824098240, aminites: ["AC", "SLEEPER"], rating: 4.4, arrival: "20", departure: "8", seats: [] },
    { companyname: "Patel Tours", from: "Ahmedabad", to: "Mumbai", price: 2200, email: "patel@gmail.com", phone: 9824098240, aminites: ["AC", "SLEEPER"], rating: 4.4, arrival: "20", departure: "8", seats: [] },
    { companyname: "Eagle Falcon", from: "Mumbai", to: "Ahmedabad", price: 2400, email: "eagle@gmail.com", phone: 9824098241, aminites: ["AC", "SEATER"], rating: 4.5, arrival: "22", departure: "10", seats: [] },
    { companyname: "Eagle Falcon", from: "Ahmedabad", to: "Mumbai", price: 2400, email: "eagle@gmail.com", phone: 9824098241, aminites: ["AC", "SEATER"], rating: 4.5, arrival: "22", departure: "10", seats: [] },

    // Mumbai <-> Delhi
    { companyname: "IntrCity SmartBus", from: "Mumbai", to: "Delhi", price: 3500, email: "care@intrcity.com", phone: 9810098100, aminites: ["AC", "SLEEPER"], rating: 4.7, arrival: "24", departure: "6", seats: [] },
    { companyname: "IntrCity SmartBus", from: "Delhi", to: "Mumbai", price: 3500, email: "care@intrcity.com", phone: 9810098100, aminites: ["AC", "SLEEPER"], rating: 4.7, arrival: "24", departure: "6", seats: [] },

    // Bengaluru <-> Chennai
    { companyname: "SRS Travels", from: "Bengaluru", to: "Chennai", price: 1100, email: "srs@gmail.com", phone: 9845098450, aminites: ["AC", "SEATER"], rating: 4.3, arrival: "14", departure: "7", seats: [] },
    { companyname: "SRS Travels", from: "Chennai", to: "Bengaluru", price: 1100, email: "srs@gmail.com", phone: 9845098450, aminites: ["AC", "SEATER"], rating: 4.3, arrival: "14", departure: "7", seats: [] },
    { companyname: "Parveen Travels", from: "Bengaluru", to: "Chennai", price: 1300, email: "parveen@gmail.com", phone: 9845098451, aminites: ["AC", "SLEEPER"], rating: 4.6, arrival: "15", departure: "8", seats: [] },
    { companyname: "Parveen Travels", from: "Chennai", to: "Bengaluru", price: 1300, email: "parveen@gmail.com", phone: 9845098451, aminites: ["AC", "SLEEPER"], rating: 4.6, arrival: "15", departure: "8", seats: [] },

    // Bengaluru <-> Hyderabad
    { companyname: "Orange Travels", from: "Bengaluru", to: "Hyderabad", price: 1600, email: "orange@gmail.com", phone: 9849098490, aminites: ["AC", "SLEEPER"], rating: 4.6, arrival: "18", departure: "8", seats: [] },
    { companyname: "Orange Travels", from: "Hyderabad", to: "Bengaluru", price: 1600, email: "orange@gmail.com", phone: 9849098490, aminites: ["AC", "SLEEPER"], rating: 4.6, arrival: "18", departure: "8", seats: [] },
    { companyname: "VRL Travels", from: "Bengaluru", to: "Hyderabad", price: 1500, email: "vrl@gmail.com", phone: 9849098491, aminites: ["AC", "SEATER"], rating: 4.4, arrival: "19", departure: "9", seats: [] },
    { companyname: "VRL Travels", from: "Hyderabad", to: "Bengaluru", price: 1500, email: "vrl@gmail.com", phone: 9849098491, aminites: ["AC", "SEATER"], rating: 4.4, arrival: "19", departure: "9", seats: [] },

    // Pune <-> Hyderabad
    { companyname: "Orange Travels", from: "Pune", to: "Hyderabad", price: 1900, email: "orange@gmail.com", phone: 9849098490, aminites: ["AC", "SLEEPER"], rating: 4.5, arrival: "20", departure: "8", seats: [] },
    { companyname: "Orange Travels", from: "Hyderabad", to: "Pune", price: 1900, email: "orange@gmail.com", phone: 9849098490, aminites: ["AC", "SLEEPER"], rating: 4.5, arrival: "20", departure: "8", seats: [] },

    // Pune <-> Bengaluru
    { companyname: "VRL Travels", from: "Pune", to: "Bengaluru", price: 2800, email: "vrl@gmail.com", phone: 9845012345, aminites: ["AC", "SLEEPER"], rating: 4.5, arrival: "22", departure: "8", seats: [] },
    { companyname: "VRL Travels", from: "Bengaluru", to: "Pune", price: 2800, email: "vrl@gmail.com", phone: 9845012345, aminites: ["AC", "SLEEPER"], rating: 4.5, arrival: "22", departure: "8", seats: [] },

    // Delhi <-> Lucknow
    { companyname: "R.S. Yadav Travels", from: "Delhi", to: "Lucknow", price: 1400, email: "rsyadav@gmail.com", phone: 9811098112, aminites: ["AC", "SLEEPER"], rating: 4.4, arrival: "16", departure: "8", seats: [] },
    { companyname: "R.S. Yadav Travels", from: "Lucknow", to: "Delhi", price: 1400, email: "rsyadav@gmail.com", phone: 9811098112, aminites: ["AC", "SLEEPER"], rating: 4.4, arrival: "16", departure: "8", seats: [] },

    // Lucknow <-> Kanpur
    { companyname: "UPSRTC Express", from: "Lucknow", to: "Kanpur", price: 400, email: "upsrtc@gmail.com", phone: 9811098113, aminites: ["AC", "SEATER"], rating: 4.0, arrival: "10", departure: "8", seats: [] },
    { companyname: "UPSRTC Express", from: "Kanpur", to: "Lucknow", price: 400, email: "upsrtc@gmail.com", phone: 9811098113, aminites: ["AC", "SEATER"], rating: 4.0, arrival: "10", departure: "8", seats: [] },

    // Kolkata <-> Patna
    { companyname: "Royal Cruiser", from: "Kolkata", to: "Patna", price: 1800, email: "royalcruiser@gmail.com", phone: 9830098300, aminites: ["AC", "SLEEPER"], rating: 4.3, arrival: "20", departure: "8", seats: [] },
    { companyname: "Royal Cruiser", from: "Patna", to: "Kolkata", price: 1800, email: "royalcruiser@gmail.com", phone: 9830098300, aminites: ["AC", "SLEEPER"], rating: 4.3, arrival: "20", departure: "8", seats: [] },

    // Indore <-> Bhopal
    { companyname: "Chartered Bus", from: "Indore", to: "Bhopal", price: 600, email: "chartered@gmail.com", phone: 9827098270, aminites: ["AC", "SEATER"], rating: 4.6, arrival: "11", departure: "8", seats: [] },
    { companyname: "Chartered Bus", from: "Bhopal", to: "Indore", price: 600, email: "chartered@gmail.com", phone: 9827098270, aminites: ["AC", "SEATER"], rating: 4.6, arrival: "11", departure: "8", seats: [] },

    // Mumbai <-> Nagpur
    { companyname: "Prasanna Purple", from: "Mumbai", to: "Nagpur", price: 3200, email: "prasanna@gmail.com", phone: 9822098220, aminites: ["AC", "SLEEPER"], rating: 4.5, arrival: "24", departure: "10", seats: [] },
    { companyname: "Prasanna Purple", from: "Nagpur", to: "Mumbai", price: 3200, email: "prasanna@gmail.com", phone: 9822098220, aminites: ["AC", "SLEEPER"], rating: 4.5, arrival: "24", departure: "10", seats: [] },

    // Mumbai <-> Indore
    { companyname: "Hans Travels", from: "Mumbai", to: "Indore", price: 2300, email: "hans@gmail.com", phone: 9826098260, aminites: ["AC", "SLEEPER"], rating: 4.4, arrival: "22", departure: "9", seats: [] },
    { companyname: "Hans Travels", from: "Indore", to: "Mumbai", price: 2300, email: "hans@gmail.com", phone: 9826098260, aminites: ["AC", "SLEEPER"], rating: 4.4, arrival: "22", departure: "9", seats: [] },

    // Ahmedabad <-> Surat
    { companyname: "GSRTC Express", from: "Ahmedabad", to: "Surat", price: 700, email: "gsrtc@gmail.com", phone: 9825098252, aminites: ["AC", "SEATER"], rating: 4.2, arrival: "12", departure: "8", seats: [] },
    { companyname: "GSRTC Express", from: "Surat", to: "Ahmedabad", price: 700, email: "gsrtc@gmail.com", phone: 9825098252, aminites: ["AC", "SEATER"], rating: 4.2, arrival: "12", departure: "8", seats: [] },

    // Mumbai <-> Thane
    { companyname: "Citylink Express", from: "Mumbai", to: "Thane", price: 200, email: "citylink@gmail.com", phone: 9820098201, aminites: ["AC", "SEATER"], rating: 4.1, arrival: "9", departure: "8", seats: [] },
    { companyname: "Citylink Express", from: "Thane", to: "Mumbai", price: 200, email: "citylink@gmail.com", phone: 9820098201, aminites: ["AC", "SEATER"], rating: 4.1, arrival: "9", departure: "8", seats: [] },
  ];

  for (const route of extraRoutes) {
    const exists = await busCol.findOne({ companyname: route.companyname, from: route.from, to: route.to });
    if (!exists) {
      await busCol.insertOne(route);
      console.log("Inserted extra route:", route.companyname, route.from, "->", route.to);
    }
  }

  console.log("Seed completed successfully!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Error seeding:", err);
  process.exit(1);
});
