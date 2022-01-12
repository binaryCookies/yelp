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
  catchAsync(async (req, res, next) => {
    if (!req.body.campground)
      throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);
    //  res.send(req.body); // testing post route
    await campground.save();
    // console.dir(req);
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

//? VIDEO 444 More Errors
app.all("*", (req, res, next) => {
  next(new ExpressError("PAGE NOT FOUND", 404));
});

//? VIDEO 442 Basic Error Handling
app.use((err, req, res, next) => {
  //? destructured from Error (ExpressError)
  const { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).send(message);
  res.send("OH BOY, SOMETHING WENT WRONG!");
});

app.listen(3000, (req, res) => {
  console.log("SERVING ON PORT 3000");
});
