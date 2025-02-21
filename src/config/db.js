const mongoose = require("mongoose");
const mondbUrl =
  "mongodb+srv://kaveri:6302747382@cluster0.db24r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDb = () => {
  return mongoose.connect(mondbUrl);
};

module.exports = { connectDb };
