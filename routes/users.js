//* VIDEO 512 REGISTER - POST request route for registering user, GET request to show form, GET request to login, POST request login to login, and, logout

const express = require("express");
const router = express.Router();
// VIDEO 513
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const { authenticate } = require("passport/lib");
//VIDEO 514
const passport = require("passport");
router.get("/register", (req, res) => {
  res.render("users/register");
});

// CREATE USER VIDEO 513
router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      // Destructure what we want from req.body
      const { email, username, password } = req.body;
      // Pass email and username to new User
      const user = new User({ email, username });
      // Call User.register() takes instance of new user and should also hash the password (because of passport-local-mongoose)
      const registeredUser = await User.register(user, password);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("register");
    }
    // console.log(registeredUser);
    req.flash("success", "Welcome to Yelp Camp!");
    res.redirect("/campgrounds");
  })
);

//* VIDEO 514 LOGIN ROUTES - passport.authenticate
router.get("/login", (req, res) => {
  return res.render("users/login");
});
// possible to use in addition to auth local we can use different route to auth google or twitter.
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome Back");
    res.redirect("/campgrounds");
  }
);

module.exports = router;
