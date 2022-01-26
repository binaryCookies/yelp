//? Mongoose VIDEO 409
//? Step 2: export modules in seedHelpers file
//? import modules to index.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// video 471
const Review = require("./review");

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  //? VIDEO 464 Review model of one to many
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});
//*************
//? Video 471 Campground delete middleware (delete reviews asociated with the campground when a campground is deleted)
//? app.js delete route: findByIdAndDelete triggers findOneAndDelete mongoose middleware
// CampgroundSchema.post("findOneAndDelete", async function () {
//   // console.log("deleted"); // check if delete campground midleware ran
//   //? Step 2 How to check contents of what is deleted -add(doc) as parameter to function
// });

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  //? How to check wontents of what is deleted -add(doc as parameter to function)
  // console.log(doc); // showing when deleting a campground reviews are deleted
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

// compiles the model from Schema
module.exports = mongoose.model("Campground", CampgroundSchema);
