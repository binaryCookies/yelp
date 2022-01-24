//? VIDEO 464. Defining The Review Model
//? one to many. one campground with many reviews

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { string } = require("joi");

const reviewSchema = new Schema({
  body: String,
  rating: Number,
});

//? CONVENTION: MODEL IS CAPITAL AND SINGULAR
module.exports = mongoose.model("Review", reviewSchema);
