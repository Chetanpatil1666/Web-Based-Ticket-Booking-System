const mongoose = require("mongoose");
require("dotenv").config();

let connect = () => {
  const mongoUri =
    process.env.MONGO_PATH ||
    process.env.MONGO_URL ||
    process.env.MONGODB_URL ||
    process.env.DATABASE_URL ||
    "mongodb://127.0.0.1:27017/newbus";
  return mongoose.connect(mongoUri);
};

module.exports= connect;

// const mongoose = require("mongoose");

// let connect = () => {
//   return mongoose.connect(
//     "mongodb+srv://raman:raman@cluster0.fm7rpoi.mongodb.net/ecom",
//     { useNewUrlParser: true }
//   );
// };

// module.exports = connect;


