//* Video 486 Breaking Out Campground Routes
//* clean up app.js - put routes in one place
/**
 ** Cut and paste routes from app.js(note things like depandicies will break)
 ** Copied catchAsync to campgrounds.js
 ** Copied expressError to campgrounds.js
 ** Copied campground model to campgrounds.js
 ** Changed path from above copied to reflect we are in nested in routes folder
 ** Cut paste validateCampground to campgrounds.js
 ** Copied campgroundSchema (updated path deleted the reviewSchema) although it was working I followed the video
 ** VIDEO 515 new file middleware.js isLoggedIn Middleware Passport: using isAuthenticated on get/new, import middleware.js
 ** VIDEO 520 Adding an Author - show route chain on .populate ('author')
 ** VIDEO 522 CAMPGROUND PERMISSIONS -  break the update route into 2 steps. check if current campground ID has same ID as current logged in user sending this request
 **   1. Find campground -> 2. Check if we can update
 ** VIDEO 523 AUTHORIZATION MIDDLEWARE - isAuthor middleware applied to edit, delete, route   (deleted old permission block for isAuthor middleware ), required { isLoggedIn, isAuthor, validateCampground }, exported modules from middleware file
 ** Moved validateReviews to middleware file from reviews.js file
 ** VIDEO 525 MORE REVIEWS AUTHORIZATION - campground.js populate author of each review, added reviews by in show.ejs under reviews section. (username access possible by review loop of each campground), hide delete button, protect delete route,
 */

const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
// const { campgroundSchema } = require("../schemas.js");  moved to middleware file

const Campground = require("../models/campground");
//VIDEO 515 isLoggedIn
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const ExpressError = require("../utils/ExpressError");
const campgrounds = require("../controllers/campgrounds");
//VIDEO 532 THE MULTER MIDDLEWARE
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); //destination and path

//*VIDEO 528 A FANCY WAY TO RESTRUCTURE ROUTES - docs: express router.route
//? All Campgrounds - INDEX Route
router
  .route("/")
  .get(catchAsync(campgrounds.index))
  // .post(
  //   isLoggedIn,
  //   validateCampground, //added validateCampground video 447, isLoggedIn Video 515
  //   catchAsync(campgrounds.createCampground));//
  .post(upload.array("image"), (req, res) => {
    //VIDEO 532 MULTER - upload.single('image') - image is the form field name
    console.log(req.body, req.files); // pluaralized file when setting changed from single to array
  });

//? Video 412 new.ejs, Create New campground - Form. MUST HAVE NEW ROUTE ABOVE ROUTE ID
router.get("/new", isLoggedIn, campgrounds.renderNewForm);
router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//? VIDEO 413 - Route Edit.ejs: edit and update, 522 Campground Permissions (server side, prevent get edit page request from postman etc )
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

//? VIDEO 412 new.ejs - New and Create Submit Form
//? (must parse data urlendoded...)
//? Video 442: Added next, try...
//? VIDEO 443. Defining Express Error Class try and catch replaced
//? VIDEDO 467 Validate reviews.
//--
//? VIDEO 411 Campground Show Page - use id to lookup corresponding campground
//? VIDEO 468 Displaying reviews, added populate - VIDEO 525 MORE REVIEWS AUTHORIZATION - populate author of each review
//--
//? VIDEO 413 - Route Edit.ejs: edit and update
//--
//? 522 Campground Permissions - adding authorization server side

module.exports = router;
