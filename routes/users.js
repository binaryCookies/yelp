//* VIDEO 512 REGISTER - POST request route for registering user, GET request to show form, GET request to login, POST request login to login, and, logout
//* VIDEO 516 ADDING LOGOUT - add logout route, login button margin left auto : ms-auto
//* VIDEO 518 FIXING REGISTER ROUTE - so when we register we dont need to sign in after we get auto loggedin after registering (docs: passport log in)
//* VIDEO 519 Behaviour: redirect user to originalUrl or to /campgrounds, modified middleware, user.js, print path in app.js res.local code block
//*VIDEO 527 ADDING REVIEWS CONTROLLER

const express = require("express");
const router = express.Router();
//VIDEO 514
const passport = require("passport");
// VIDEO 513
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const users = require("../controllers/users");

//CREATE USER VIDEO 513
router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

//VIDEO 514 LOGIN ROUTES - passport.authenticate
// possible to use in addition to auth local we can use different route to auth google or twitter.
router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

//VIDEO 516 ADDING LOGOUT - passport method logout
router.get("/logout", users.logout);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// // VIDEO 513
// const catchAsync = require("../utils/catchAsync");
// const User = require("../models/user");
// const { authenticate } = require("passport/lib");
// //VIDEO 514
// const passport = require("passport");
// const req = require("express/lib/request");
// const users = require("../controllers/users");

// router.get("/register", users.renderRegister);

// //CREATE USER VIDEO 513
// router.post("/register", catchAsync(users.register));

// //VIDEO 514 LOGIN ROUTES - passport.authenticate
// router.get("/login", users.renderLogin);
// // possible to use in addition to auth local we can use different route to auth google or twitter.

// //LOGIN
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     failureFlash: true,
//     failureRedirect: "/login",
//   }),
//   users.login
// );

// //VIDEO 516 ADDING LOGOUT - passport method logout
// router.get("/logout", users.logout);

// module.exports = router;

// /******************************* */
// // router.post(
// //   "/login",
// // passport.authenticate("local", { //* REPLACED WITH MIDDLEWARE TO FIX BUG IN VIDEO 519 RESOURCES
// //     failureFlash: true,
// //     failureRedirect: "/login",
// //   }),
// //   (req, res) => {
// //     req.flash("success", "Welcome Back");
// //     const redirectUrl = req.session.returnTo || "/campgrounds"; // VIDEO 519 Resources fixed bug
// //     delete req.session.returnTo; // VIDEO 519 Resources fixed bug
// //     res.redirect(redirectUrl); // VIDEO 519 Resources fixed bug
// //   }
// // );
