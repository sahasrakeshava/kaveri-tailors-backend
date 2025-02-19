const mongoose = require("mongoose");
const mondbUrl =
  "mongodb://172.29.80.192:27017";

const connectDb = () => {
  return mongoose.connect(mondbUrl);
};

module.exports = { connectDb };
