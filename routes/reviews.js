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
 ** 524 REVIEWS PERMISSIONS - must be logged in to see form, to submit review, connect review made with associated review
 ** Update review schema, update show.ejs to hide form if currentUser is not logged in, required isLoggedIn and applied it to post route creating a review, associate currentUser with author of newly created review
 ** VIDEO 525 MORE REVIEWS AUTHORIZATION - populate author of each review, import isLoggedIn, added isReviewAuthor middleware to delete route
 ** VIDEO 527 ADDING REVIEW CONTROLLERS - require controllers/reviews.js, Test controller by creating review
 */

const express = require("express");

//* VIDEO 487 Added mergeParams - express router keeps params separate see app.use("/campgrounds/:id/reviews", reviews) by default no access to id in route therefore add mergeParams: true
const router = express.Router({ mergeParams: true });

const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
//VIDEO 527 ADDING REVIEW CONTROLLERS - require controllers/reviews.js
const reviews = require("../controllers/reviews");

//? VIDEO 466. CREATING REVIEWS, 524 REVIEW PERMISSIONS - isLoggedIn - Video 527 -
router.post("/", validateReview, isLoggedIn, catchAsync(reviews.createReview));

//? VIDEO 470 Delteing reviews - 525 More Review Authorizations (isLoggedin)
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);
module.exports = router;
