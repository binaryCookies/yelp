//* VIDEO 515 neew file middleware.js isLoggedIn Middleware Passport: using isAuthenticated on get/new
//* Export module to campgrounds then import
//* Added isLoggedIn to routes for delete, get/:id/edit, put/:id to edit, get add new campground
// VIDEO 515 isLoggedIn Middleware

module.exports.isLoggedIn = (req, res, next) => {
  // trigger print req.user by adding new campground. info stored in session but availalbe thx to passport
  console.log("REQ.USER", req.user);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "YOU MUST BE SIGNED IN FIRST");
    return res.redirect("/login");
  }
  next();
};
