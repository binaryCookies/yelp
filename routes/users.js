//* VIDEO 512 REGISTER - POST request route for registering user, GET request to show form, GET request to login, POST request login to login, and, logout
//* VIDEO 516 ADDING LOGOUT - add logout route, login button margin left auto : ms-auto
//* VIDEO 518 FIXING REGISTER ROUTE - so when we register we dont need to sign in after we get auto loggedin after registering (docs: passport log in)
//* VIDEO 519 Behaviour: redirect user to originalUrl or to /campgrounds, modified middleware, user.js, print path in app.js res.local code block

const express = require("express");
const router = express.Router();
// VIDEO 513
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const { authenticate } = require("passport/lib");
//VIDEO 514
const passport = require("passport");
const req = require("express/lib/request");
router.get("/register", (req, res) => {
  res.render("users/register");
});

// CREATE USER VIDEO 513
router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      // Destructure what we want from req.body
      const { email, username, password } = req.body;
      // Pass email and username to new User
      const user = new User({ email, username });
      // Call User.register() takes instance of new user and should also hash the password (because of passport-local-mongoose)
      const registeredUser = await User.register(user, password);
      // VIDEO 518 auto login after registering, requires callback - doesnt support it, note can't use passport.authticate until we authenticate a user hence the req.login code block
      // TODO Check to see why the object is written in the db after registering. I inserted the return keyword in this line: return res.redirect("register");
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash("success", "Welcome to Yelp Camp!");
        res.redirect("/campgrounds");
      });
    } catch (e) {
      req.flash("error", e.message);
      return res.redirect("register");
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
    req.flash("success", "welcome back!");
    const redirectUrl = req.session.returnTo || "/campgrounds"; // redirect user to originalUrl
    delete req.session.returnTo; // delete returnTo from session
    res.redirect(redirectUrl);
  }
);

//* VIDEO 516 ADDING LOGOUT - passport method logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
});

module.exports = router;

// router.post(
//   "/login",
//   // passport.authenticate("local", { //* REPLACED WITH MIDDLEWARE TO FIX BUG IN VIDEO 519 RESOURCES
//     failureFlash: true,
//     failureRedirect: "/login",
//   }),
//   (req, res) => {
//     req.flash("success", "Welcome Back");
//     const redirectUrl = req.session.returnTo || "/campgrounds"; // VIDEO 519 Resources fixed bug
//     delete req.session.returnTo; // VIDEO 519 Resources fixed bug
//     res.redirect(redirectUrl); // VIDEO 519 Resources fixed bug
//   }
// );
