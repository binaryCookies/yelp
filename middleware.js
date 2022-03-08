//* VIDEO 515 neew file middleware.js isLoggedIn Middleware Passport: using isAuthenticated on get/new
//* Export module to campgrounds then import
//* Added isLoggedIn to routes for delete, get/:id/edit, put/:id to edit, get add new campground
// VIDEO 515 isLoggedIn Middleware

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
