const mongoose = require("mongoose");
require("dotenv").config();

let connect = async () => {
  const primaryUri =
    process.env.MONGO_PATH ||
    process.env.MONGO_URL ||
    process.env.MONGODB_URL ||
    process.env.DATABASE_URL;

  if (primaryUri) {
    return mongoose.connect(primaryUri);
  }

  // Cloud fallback: MongoDB Atlas cluster
  const atlasUri =
    "mongodb+srv://raman:raman@cluster0.fm7rpoi.mongodb.net/ecom?retryWrites=true&w=majority";

  if (process.env.NODE_ENV === "production") {
    console.log("Connecting to production MongoDB Atlas...");
    return mongoose.connect(atlasUri);
  }

  try {
    return await mongoose.connect("mongodb://127.0.0.1:27017/newbus", {
      serverSelectionTimeoutMS: 2500,
    });
  } catch (err) {
    console.log("Local MongoDB not reachable, falling back to cloud MongoDB Atlas...");
    return mongoose.connect(atlasUri);
  }
};

module.exports = connect;

// const mongoose = require("mongoose");

// let connect = () => {
//   return mongoose.connect(
//     "mongodb+srv://raman:raman@cluster0.fm7rpoi.mongodb.net/ecom",
//     { useNewUrlParser: true }
//   );
// };

// module.exports = connect;


