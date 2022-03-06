//* VIDEO 512 REGISTER - POST request route for registering user, GET request to show form, GET request to login, POST request login to login, and, logout

const express = require("express");
const router = express.Router();
// VIDEO 513
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");

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
module.exports = router;
