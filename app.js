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
//* VIDEO 531 INTRO TO UPLOAD IMAGE PROCESS - we're using cloudinary alternative is GridFS, AWS.
//* 532 THE MULTER MIDDLEWARE - At new form setting for to have enctype="multipart/form-data" (url-endoded won't work to upload images), add new input - muted old image input, go to where form is submittd - campgrounds post route, testing post route with res.send req.body, adding express.js/multer middleware to parse enctype="multipart/form-data", from Multer docs adding: const multer  = require('multer'), const upload = multer({ dest: 'uploads/' }) to route, tested route w/ console.log(req.body, req.file), camprground post route changed single('image') to array('image), new form input image added attribute multiple,
//*Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form
//* VIDEO 566 Mongo Injection - added npm package express-mongo-sanitize - deletes $ and .dots from user inputs

//VIDEO 534 ENVIRONMENT VARIABLES WITH dotenv: DOTENV - npm package - HOW TO ACCESS THE .env file from other files (kept in node environment during development phase)
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// require("dotenv").config(); //Video 570 mute above to not show stack trace

// console.log(process.env.CLOUDINARY_CLOUD_NAME);

//* Express
const express = require("express");
const path = require("path"); // to work with directory paths
const app = express();
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
//* VIDEO 466. Creating Reviews
const Review = require("./models/review");

//* Video 489 Configuring Session
const session = require("express-session"); // to be able to  access session data or store server side

//*Video 490 Setting Up Flash
const flash = require("connect-flash");

const reviewRoutes = require("./routes/reviews");
//* Video 486 Breaking Out Routes
const campgroundRoutes = require("./routes/campgrounds");
//* VIDEO 512 REGISTER FORM
const userRoutes = require("./routes/users");

//* Mongoose - created db name yelp-camp from path
const mongoose = require("mongoose");

//* 423. A New EJS Tool For Layouts - ejs-mate
const ejsMate = require("ejs-mate");

//* VIDEO 443. Defining Express Error Class -> MUTED video 487 Breaking Out Review Routes
// const catchAsync = require("./utils/catchAsync");

//* Video 447 Joi Validation Middleware //? VIDEO 467 Review Validation
const { campgroundSchema, reviewSchema } = require("./schemas.js");

//* VIDEO 413 npm i method-override (fake a put, patch or delete)
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

//*VIDEO 566 MONGO INJECTION - database protection - NPM package
const mongoSanitize = require("express-mongo-sanitize");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DATABASE CONNECTED");
});

//* VIDEO 412 new.ejs - New and Create Submit Form. Express, Method-Override middleware.
app.use(express.urlencoded({ extended: true }));
//* VIDEO 413 npm i method-override
app.use(methodOverride("_method"));
/**********/

//* VIDEO 488 Serving Static Assets - creating public directory
app.use(express.static(path.join(__dirname, "public")));
//* VIDEO 566 MONGO INJECTION - To remove data using these defaults: By default, $ and . characters are removed completely
app.use(mongoSanitize());

//* VIDEO 489 Configuring Sesssion - passing in config object, config will change after development on deployment, we wont use local store after development rather mongodb store
const sessionConfig = {
  name: "session", //changes default name from conect.sid to make it harder to find by xscript hacker
  secret: "thisshoulbeabettersecret",
  resave: false,
  saveUninitialized: true,
  //  Explainer: Date.now in millieseconds 1000 milleseconds in a second, 60 seconds in a minute, 60 minutes in an hour, 24 hours per day, 7 days per week
  cookie: {
    // Extra security to prevent client side cross scripting
    httpOnly: true,
    // secure:true, // this setting works in deployment not local
    // Setting Cookie to expire in 1 week
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
  // VIDEO 517 currentUser Helper - in all templates we now have access to currentUser - go to navbar.ejs to display buttons if there is a currentUser
  // console.log(req.session); // VIDEO 519 print session
  console.log(req.query);
  res.locals.currentUser = req.user;
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

//* HOME PAGE ROUTE
app.get("/", (req, res) => {
  // console.log(STATUS_CODES);
  // console.log(req);
  res.render("home");
});
// INITIAL TESTING ROUTE
// app.get("/makecampground", async (req, res) => {
//   const camp = new Campground({
//     title: "My backyard",
//     description: "Cheap camping",
//   });
//   await camp.save();
//   res.send(camp);
// });
/*********** */

//* 423. A New EJS Tool For Layouts - ejs-mate (found on gitHub) Express, Mongoose, ejs-mate and Method-Override middleware.
app.engine("ejs", ejsMate);
//* HOME.EJS Route
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//* VIDEO 444 More Errors, * means every path, this only runs if none of the preceeding handlers did
app.all("*", (req, res, next) => {
  next(new ExpressError("PAGE NOT FOUND. Dev-Mode: See stack trace", 404));
});

//* VIDEO 442 Basic Error Handling
app.use((err, req, res, next) => {
  //* Viddeo 444: destructured from Error (ExpressError)
  // const { statusCode = 500, message = "Something Went Wrong" } = err;
  //* VIDEO 445: above is replaced with:
  const { statusCode = 500 } = err;
  if (!err.message) err.message("Oh No, Something Went Wrong!");
  //* VIDEO 445: changed .send(message) -> .render('error'),  passed {err} to error.ejs template
  res.status(statusCode).render("error", { err });
  // res.send("OH BOY, SOMETHING WENT WRONG!");
});

app.listen(3000, (req, res) => {
  console.log("SERVING ON PORT 3000");
});
