//* VIDEO 515 neew file middleware.js isLoggedIn Middleware Passport: using isAuthenticated on get/new
//* Export module to campgrounds then import
//* Added isLoggedIn to routes for delete, get/:id/edit, put/:id to edit, get add new campground
// VIDEO 515 isLoggedIn Middleware

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    console.log(req.path, req.originalUrl); // print path
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

// module.exports.isLoggedIn = (req, res, next) => {
//   // trigger print req.user by adding new campground. info stored in session but available thx to passport
//   // VIDEO 517:  console.log("REQ.USER", req.user);
//   if (!req.isAuthenticated()) {
//     req.session.returnTo = req.originalUrl; // VIDEO 519 See users.js: muted to fix bug, bug fixed in middleware in the app.js where res.locals.currentUser = req.user is found
//     req.flash("error", "YOU MUST BE SIGNED IN FIRST");
//     return res.redirect("/login");
//   }
//   next();
// };
