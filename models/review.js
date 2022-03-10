//? VIDEO 464. Defining The Review Model
//? one to many. one campground with many reviews
//? author VIDEO 524 REVIEWS PERMISSION

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { string } = require("joi");

const reviewSchema = new Schema({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

//? CONVENTION: MODEL IS CAPITAL AND SINGULAR
module.exports = mongoose.model("Review", reviewSchema);
