//* YELP - CODE ALONG - Start with git

//? Express
const express = require("express");
const path = require("path");
const app = express();
const Campground = require("./models/campground");

//?Mongoose - created db name yelp-camp from path
const mongoose = require("mongoose");
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
//? HOME.EJS Route
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//? All Campgrounds - INDEX Route
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

//? Video 412 new.ejs, Create New campground - Form
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//? VIDEO 412 new.ejs - New and Create Submit Form
//? (must parse data urlendoded...)
app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  //  res.send(req.body); // testing post route
  await campground.save();
  console.dir(req);
  res.redirect(`/campgrounds/${campground._id}`);
});

//? VIDEO 410 Campground Show Page - use id to lookup corresponding campground
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

//? VIDEO 413 - Route Edit.ejs: edit and update
app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});
//? VIDEO 413 - Route Edit.ejs: edit and update
app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
  // res.send("it worked");
});

app.delete(`/campgrounds/:id`, async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.listen(3000, (req, res) => {
  console.log("SERVING ON PORT 3000");
});
