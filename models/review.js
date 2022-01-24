//? VIDEO 464. Defining The Review Model
//? one to many. one campground with many reviews

const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose.Schema;

const reviewSchema = new Schema({
  body: String,
  rating: Number,
});

//? CONVENTION: MODEL IS CAPITAL AND SINGULAR
module.exports = mongoose.model("Review", reviewSchema);
