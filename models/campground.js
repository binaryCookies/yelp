//? Mongoose

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

// compiles the model from Schema
module.exports = mongoose.model("Campground", CampgroundSchema);
