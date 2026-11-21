const mongoose = require("mongoose");
(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/newbus");
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  for (let c of collections) {
    const count = await db.collection(c.name).countDocuments();
    console.log(c.name + ": " + count + " documents");
  }
  process.exit(0);
})();

