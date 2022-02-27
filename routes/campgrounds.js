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
 **
 */

const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require("../schemas.js");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
//?VIDEO 447
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  // console.log(error);
  // console.dir(req.body.campground.title);
  // console.dir(req.body);
  // console.log(STATUS_CODES);
  // console.log(req);
  if (error) {
    const msg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//? All Campgrounds - INDEX Route
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//? Video 412 new.ejs, Create New campground - Form
router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});
//? VIDEO 412 new.ejs - New and Create Submit Form
//? (must parse data urlendoded...)
//? Video 442: Added next, try...
//? VIDEO 443. Defining Express Error Class try and catch replaced
//? VIDEDO 467 Validate reviews.
router.post(
  "/",
  //? added validateCampground video 447
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    //  res.send(req.body); // testing post route
    await campground.save();
    // console.dir(req);
    // console.log(req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//? VIDEO 411 Campground Show Page - use id to lookup corresponding campground
//? VIDEO 468 Displaying reviews, added populate
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    // console.log(campground);
    res.render("campgrounds/show", { campground });
  })
);

//? VIDEO 413 - Route Edit.ejs: edit and update
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
//? VIDEO 413 - Route Edit.ejs: edit and update
router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
    // res.send("it worked");
  })
);

module.exports = router;