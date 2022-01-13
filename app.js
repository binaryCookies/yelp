//* YELP - CODE ALONG - Start with git

//? Express
const express = require("express");
const path = require("path");
const app = express();
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");

//?Mongoose - created db name yelp-camp from path
const mongoose = require("mongoose");
//? 423. A New EJS Tool For Layouts - ejs-mate
const ejsMate = require("ejs-mate");
//? VIDEO 443. Defining Express Error Class
const catchAsync = require("./utils/catchAsync");
//? Video 447 Joi Validation Middleware
const { campgroundSchema } = require("./schemas.js");
//? VIDEO 413 npm i method-override (fake a put, patch or delete)
const methodOverride = require("method-override");
const campground = require("./models/campground.js");
const { findById } = require("./models/campground");
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DATABASE CONNECTED");
});

//? VIDEO 412 new.ejs - New and Create Submit Form
app.use(express.urlencoded({ extended: true }));
//?VIDEO 413 npm i method-override
app.use(methodOverride("_method"));
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  console.log(error);
  if (error) {
    const msg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//? HOME PAGE ROUTE
app.get("/", (req, res) => {
  res.render("home");
});
// //? Initial Testing route
// app.get("/makecampground", async (req, res) => {
//   const camp = new Campground({
//     title: "My backyard",
//     description: "Cheap camping",
//   });
//   await camp.save();
//   res.send(camp);
// });
//? 423. A New EJS Tool For Layouts - ejs-mate (found on gitHub)
app.engine("ejs", ejsMate);
//? HOME.EJS Route
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//? All Campgrounds - INDEX Route
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//? Video 412 new.ejs, Create New campground - Form
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//? VIDEO 412 new.ejs - New and Create Submit Form
//? (must parse data urlendoded...)
//? Video 442: Added next, try...
//? VIDEO 443. Defining Express Error Class try and catch replaced
app.post(
  "/campgrounds",
  //? added validateCampground video 447
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    //  res.send(req.body); // testing post route
    await campground.save();
    // console.dir(req);
    // console.log(req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//? VIDEO 411 Campground Show Page - use id to lookup corresponding campground
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

//? VIDEO 413 - Route Edit.ejs: edit and update
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
//? VIDEO 413 - Route Edit.ejs: edit and update
app.put(
  "/campgrounds/:id",
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

app.delete(
  `/campgrounds/:id`,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

//? VIDEO 444 More Errors, * means every path, this only runs if none of the preceeding handlers did
app.all("*", (req, res, next) => {
  next(new ExpressError("PAGE NOT FOUND. Dev-Mode: See stack trace", 404));
});

//? VIDEO 442 Basic Error Handling
app.use((err, req, res, next) => {
  //? Viddeo 444: destructured from Error (ExpressError)
  // const { statusCode = 500, message = "Something Went Wrong" } = err;
  //? VIDEO 445: above is replaced with:
  const { statusCode = 500 } = err;
  if (!err.message) err.message("Oh No, Something Went Wrong!");
  //? VIDEO 445: changed .send(message) -> .render('error'),  passed {err} to error.ejs template
  res.status(statusCode).render("error", { err });
  // res.send("OH BOY, SOMETHING WENT WRONG!");
});

app.listen(3000, (req, res) => {
  console.log("SERVING ON PORT 3000");
});

//! ///////////////////////////////////////////////////////////////////////
//? OLD CODE reference
// app.post(
//   "/campgrounds",
//   //? added validateCampground video 447
//   validateCampground,
//   catchAsync(async (req, res, next) => {
//     // if (!req.body.campground)
//     //   throw new ExpressError("Invalid Campground Data", 400);
//     //? Video 446. Joi Schema validations -replaces above validation. This is not a mongoose schema. This will validate data before we attempt to save to mongoDB (copied and moved above Section video 447)
//     // const campgroundSchema = Joi.object({
//     //   campground: Joi.object({
//     //     title: Joi.string().required(),
//     //     price: Joi.number().required().min(0),
//     //     image: Joi.string().required(),
//     //     location: Joi.string().required(),
//     //     description: Joi.string().required(),
//     //   }).required(),
//     // });
//     // //turned off  video 446 skip to below
//     // // const result  = campgroundSchema.validate(req.body);
//     // // console.log(result);
//     // // if (result.error) {
//     // //   //error is built-in (pretty sure from express)
//     // //   throw new ExpressError(result.error.details, 400);
//     // // }
//     // //? updated method: it will render in front end the error message - see error as I am logging to console. In production use a logger library
//     // const { error } = campgroundSchema.validate(req.body);
//     // console.log(error);
//     // if (error) {
//     //   const msg = error.details.map((element) => element.message).join(",");
//     //   //error is built-in (pretty sure from express)
//     //   throw new ExpressError(msg, 400);
//     //   // throw new ExpressError(result.error.details, 400); // turned off video 446
//     // }

//     const campground = new Campground(req.body.campground);
//     //  res.send(req.body); // testing post route
//     await campground.save();
//     // console.dir(req);
//     // console.log(req.body.campground);
//     res.redirect(`/campgrounds/${campground._id}`);
//   })
// );
