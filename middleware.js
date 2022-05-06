//* VIDEO 515 neew file middleware.js isLoggedIn Middleware Passport: using isAuthenticated on get/new
//* Export module to campgrounds then import
//* Added isLoggedIn to routes for delete, get/:id/edit, put/:id to edit, get add new campground
//* VIDEO 515 isLoggedIn Middleware
//* Required Campground, campgroundSchema, review added isAuthor

//* Required below as of VIDEO 523 AUTHORIZATION MIDDLEWARE
const { campgroundSchema, reviewSchema } = require("./schemas.js"); // JOI validations
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // console.log(req.path, req.originalUrl); // print path
    // trigger print req.user by adding new campground. info stored in session but available thx to passport
    // VIDEO 517:  console.log("REQ.USER", req.user);
    req.session.returnTo = req.originalUrl; // VIDEO 519
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

//?525 AUTHORIZATION MIDDLEWARE { id, reviewId } -> redirect using id, find review using reviewId
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params; // property of :id and :reviewId. Video 525 - reviewId as per delete route path
  const review = await Review.findById(reviewId); // 525 - Step 1 find review by id
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

//?VIDEO 522 CAMPGROUND PERMISSIONS
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id); // Step 1 find campground by id
  if (!campground.author.equals(req.user._id)) {
    // Step 2 Verify if current user is author of the campground
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campgrounds/${id}`); // Step 3 redirect to show page
  }
  next();
};

//?VIDEO 447
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  // console.log(error);
  // console.dir(req.body.campground.title);
  // console.dir(req.body);
  // console.log(STATUS_CODES);
  // console.log(req);
  if (error) {
    const msg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//? VIDEO 467 Validating Reviews middleware & Moved VIDEO 523 AUTHORIZATION MIDDLEWARE
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
