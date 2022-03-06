//* VIDEO 487 Breaking Out Review Routes - Moving review routes from app.js to reviews.js

/**
 ** Cut and paste review routes
 ** required express, created router
 ** renamed app to router for each route
 ** required reviews path in app.js file
 ** prefixed routes - see app.use in app.js
 ** copied catchAsync - edited the path to reflect the new loction
 ** Copied from app.js required Campground and require Review
 ** Cut validateReview middleware which requires expressError utility
 ** Copied expressError utility required by JOI validation validateReview ->  expressError
 ** Copied reviewSchema deleted campgroundSchema from it as not required here (JOI Validation Middleware)
 */

const express = require("express");

//* VIDEO 487 Added mergeParams - express router keeps params separate see app.use("/campgrounds/:id/reviews", reviews) by default no access to id in route therefore add mergeParams: true
const router = express.Router({ mergeParams: true });

const Campground = require("../models/campground");
const Review = require("../models/review");

//* VIDEO 487 removed the campgroundSchema, not needed here
const { reviewSchema } = require("../schemas.js");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

//? VIDEO 467 Validating Reviews middleware
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//? VIDEO 466. CREATING REVIEWS
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    // res.send("Step 1: THIS IS THE ROUTE TEST, SUBMIT TO FORM WITH SAME PATH");
    const campground = await Campground.findById(req.params.id); // Step 2 test w/ console.log(req.params)
    // Step 3Add review model
    const review = new Review(req.body.review);
    // console.log(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created a new review");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//? VIDEO 470 Delteing reviews
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // MongoDB The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    // res.send("delete me");
    //* Video 494 Flash Success Partial
    req.flash("success", "Successfully deleted a review");
    res.redirect(`/campgrounds/${id}`);
  })
);
module.exports = router;
