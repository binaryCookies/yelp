//* Mongoose VIDEO 409
//* Step 2: export modules in seedHelpers file
//* import modules to index.js
//* VIDEO 520 ADDING AN AUTHOR TO CAMPGROUND - connect user model with particular campgrounds and particular reviews. EX. So I can create a review assoiciated with my account and only I could edit or delete
//* 520: add author field to model, update seeds index file to include author field (get existing user id from mongodb), run: node seeds/index.js, check db of campgrounds to have author id, populate model to get user name (campgrounds.js), show route chain on .populate ('author'), show.ejs added author and username, update campgrounds route where we create a route to associate current user with campground being created
//* VIDEO 536 STORING UPLOADED IMAGE LINKS IN MONGO - campground model changed image property to images and the value from string to array (joi validation will be affected - next step fix), controllers campground.js map over array in req object provided from multer save filenames and path of images uploaded, loop over image properties in campgrounds/show page, updated the routes/campgrounds "/" route by adding upload.array("image") to the post validation,

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// video 471
const Review = require("./review");

const ImageSchema = new Schema({
  //to setup virtual (which means not storing to db) property to each image, change uri so cludinary can crop images to thumbnails
  url: String,
  filename: String,
});

// https://res.cloudinary.com/dpmninzv7/image/upload/v1647701336/YelpCamp/vkva0tqvj7ghxulgcyvx.jpg //to reference cloudinary url format

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200"); //to replace path with width dimension
});

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    //to accept geoJSON data as per mongoose docs and used by: mongoDB, mapBox
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  price: Number,
  description: String,
  location: String,
  // VIDEO 519 Adding an Author - update seeds index file to include author field
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  // VIDEO 464 Review model of one to many
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
