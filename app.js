//* YELP - CODE ALONG - Start with git

//? Express
const express = require("express");
const path = require("path");
const app = express();
const Campground = require("./models/campground");

//?Mongoose - created db name yelp-camp from path
const mongoose = require("mongoose");
const campground = require("./models/campground.js");
const { findById } = require("./models/campground");
mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DATABASE CONNECTED");
});

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

//? VIDEO 410 Campground Show - use id to lookup corresponding campground
app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.listen(3000, (req, res) => {
  console.log("SERVING ON PORT 3000");
});
