//* YELP - CODE ALONG - Start with git
//* VIDEO 489 CONFIGURING SESSION - installed npm session npm i express-session, required session
//* VIDEO 490 SETTING UP FLASH - install npm package connect-flash and required flash, added flash to routes -> campgrounds.js see in creating new campgrounds, added middleware in app.js, diplayed success in boilerplate
//* VIDEO 494 FLASH SUCCESS PARTIAL - using bootstrap to flash messages in campgrounds.js, reviews.js
//* VIDEO 495 FLASH ERROR PARTIALS - flash.ejs
//* VIDEO 509 INTRODUCTION TO PASSPORT (passport is a librairy) - Auth basic summary -> set up min 4  routes, serve forms to login and register, routes todo the logging in and registration logout route, middleware to force you to login for certain routes, authorization to connect user to campgrounds,
//* install packages npm passport-local-mongoose, passport-local (npm install passport mongoose passport-local-mongoose)
//* VIDEO 510 CREATING OUR USER MODEL
//* VIDEO 511 CONFIGURING PASSPORT: require: User model, passport, passport-local. Use: passport.initialize, passport.session, new LocalStrategy, passport.serializeUser, passport.deserializeUser. Hard coded new user to test Auth route. Register a user call User.register()
//* VIDEO 512 REGISTER FORM: Setup register route and form to serve. GET request /register - FORM, POST /register - create a user

//? Express
const express = require("express");
const path = require("path");
const app = express();
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
//? VIDEO 466. Creating Reviews
const Review = require("./models/review");

//* Video 489 Configuring Session
const session = require("express-session");

//*Video 490 Setting Up Flash
const flash = require("connect-flash");

const reviewRoutes = require("./routes/reviews");
//* Video 486 Breaking Out Routes
const campgroundRoutes = require("./routes/campgrounds");
//* VIDEO 512 REGISTER FORM
const userRoutes = require("./routes/users");

//?Mongoose - created db name yelp-camp from path
const mongoose = require("mongoose");
//? 423. A New EJS Tool For Layouts - ejs-mate
const ejsMate = require("ejs-mate");

//? VIDEO 443. Defining Express Error Class -> MUTED video 487 Breaking Out Review Routes
// const catchAsync = require("./utils/catchAsync");

//? Video 447 Joi Validation Middleware //? VIDEO 467 Review Validation
const { campgroundSchema, reviewSchema } = require("./schemas.js");

//? VIDEO 413 npm i method-override (fake a put, patch or delete)
const methodOverride = require("method-override");
const campground = require("./models/campground.js");
const { findById } = require("./models/campground");
const { STATUS_CODES } = require("http");
const review = require("./models/review");

//* VIDEO 511 CONFIGURING PASSPORT
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DATABASE CONNECTED");
});

//? VIDEO 412 new.ejs - New and Create Submit Form. Express, Method-Override middleware.
app.use(express.urlencoded({ extended: true }));
//?VIDEO 413 npm i method-override
app.use(methodOverride("_method"));
/**********/

//* VIDEO 488 Serving Static Assets - creating public directory
app.use(express.static(path.join(__dirname, "public")));

//* VIDEO 489 Configuring Sesssion - passing in config object, config will change after development on deployment, we wont use local store after development rather mongodb store
const sessionConfig = {
  secret: "thisshoulbeabettersecret",
  resave: false,
  saveUninitialized: true,
  //  Explainer: Date.now in millieseconds 1000 milleseconds in a second, 60 seconds in a minute, 60 minutes in an hour, 24 hours per day, 7 days per week
  cookie: {
    // Extra security to prevent client side cross scripting
    httpOnly: true,
    //* Setting Cookie to expire in 1 week
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

//*Video 493 Setting Up Flash - added flash to routes -> campgrounds.js in creating new campgrounds
app.use(flash());

//* VIDEO 511 CONFIGURING PASSPORT - note passport.session should be used after app.use(session(sessionConfig))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); // store in session
passport.deserializeUser(User.deserializeUser()); // unstore in session
// see static methods github docs passport-local-mongoose
/****/

//* - flash middleware - whatever success from the res.locals.success is we will have access to (must be before our route handlers)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  // Video 495 Flash Errors Partial
  res.locals.error = req.flash("error");
  next();
});

//* Video 511: test auth route passport
app.get("/fakeuser", async (req, res) => {
  const user = new User({ email: "yanal@myemail.com", username: "yanal999" });
  const newUser = await User.register(user, "monkey");
  res.send(newUser);
});
/****/

//* Video 487 - Express router middleware(route handlers), prefixed routes
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

//? HOME PAGE ROUTE
app.get("/", (req, res) => {
  // console.log(STATUS_CODES);
  console.log(req);
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
/*********** */

//? 423. A New EJS Tool For Layouts - ejs-mate (found on gitHub) Express, Mongoose, ejs-mate and Method-Override middleware.
app.engine("ejs", ejsMate);
//? HOME.EJS Route
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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
