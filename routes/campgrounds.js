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
 **
 */

const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
// const { campgroundSchema } = require("../schemas.js");  moved to middleware file

const Campground = require("../models/campground");
//* VIDEO 515 isLoggedIn
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const ExpressError = require("../utils/ExpressError");

//? All Campgrounds - INDEX Route
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//? Video 412 new.ejs, Create New campground - Form
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

//? VIDEO 412 new.ejs - New and Create Submit Form
//? (must parse data urlendoded...)
//? Video 442: Added next, try...
//? VIDEO 443. Defining Express Error Class try and catch replaced
//? VIDEDO 467 Validate reviews.

router.post(
  "/",
  // added validateCampground video 447, isLoggedIn Video 515
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    //  res.send(req.body); // testing post route
    campground.author = req.user._id; // VIDEO 520 Adding Author to Campground
    await campground.save();
    // Video 493 Setting up Flash - added to our template to display flash msg - defined a middleware in app.js
    req.flash("success", "Successfully made a new campground");
    return res.redirect(`/campgrounds/${campground._id}`);
    // console.dir(req);
    // console.log(req.body.campground);
  })
);

//? VIDEO 411 Campground Show Page - use id to lookup corresponding campground
//? VIDEO 468 Displaying reviews, added populate
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate("reviews")
      .populate("author");
    console.log(campground); // print to test if author and username show
    //* Video 495 Flash Error Partial - flash msg if campground not found
    if (!campground) {
      req.flash("error", "Cannot find that campground");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
    // console.log(campground);
  })
);

//? VIDEO 413 - Route Edit.ejs: edit and update, 522 Campground Permissions (server side, prevent get edit page request from postman etc )
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id); // Step 1 find campground by id
    if (!campground) {
      req.flash("error", "Cannot find that campground"); // Video 495 Flash Error Partial - flash msg if campground not found
      return res.redirect("/campgrounds");
    }
    // if (!campground.author.equals(req.user._id)) { // muted video 523
    //   Step 2 Verify if current user is author of the campground
    //   req.flash("error", "You do not have permission to do that");
    //   return res.redirect(`/campgrounds/${id}`); // Step 3 redirect to show page
    // }

    res.render("campgrounds/edit", { campground });
  })
);

//? VIDEO 413 - Route Edit.ejs: edit and update
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.camp,
    });
    //* Video 494 Flash Success partial - flash update msg
    req.flash("success", "Successfully updated the campground");
    res.redirect(`/campgrounds/${campground._id}`);
    // res.send("it worked");
  })
);
//? 522 Campground Permissions - adding authorization server side
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    // res.send("it worked");
    const { id } = req.params;
    // console.log(req.params);
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground");
    res.redirect("/campgrounds");
  })
);
module.exports = router;
