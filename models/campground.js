//? Mongoose VIDEO 409
//? Step 2: export modules in seedHelpers file
//? import modules to index.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
});

// compiles the model from Schema
module.exports = mongoose.model("Campground", CampgroundSchema);
