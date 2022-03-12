const Campground = require("../models/campground");
const Review = require("../models/review");
//we need to import Campground and Review models

module.exports.createReview = async (req, res) => {
  //res.send("Step 1: THIS IS THE ROUTE TEST, SUBMIT TO FORM WITH SAME PATH");
  const campground = await Campground.findById(req.params.id); // Step 2 test w/ console.log(req.params)
  //Step 3 Add review model
  const review = new Review(req.body.review);
  //console.log(req.body.review);
  //VIDEO 524 REVIEW PERMISSIONS
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Created a new review");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  //MongoDB The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(req.params.reviewId);
  // res.send("delete me");
  //* Video 494 Flash Success Partial
  req.flash("success", "Successfully deleted a review");
  res.redirect(`/campgrounds/${id}`);
};
