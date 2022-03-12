const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "welcome back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
};

// const User = require("../models/user");

// module.exports.renderRegister = (req, res) => {
//   return res.render("users/register");
// };

// module.exports.register = async (req, res, next) => {
//   try {
//     //Destructure what we want from req.body
//     const { email, username, password } = req.body;
//     //Pass email and username to new User
//     const user = new User({ email, username });
//     //Call User.register() takes instance of new user and should also hash the password (because of passport-local-mongoose)
//     const registeredUser = await User.register(user, password);
//     //VIDEO 518 auto login after registering, requires callback - doesnt support it, note can't use passport.authticate until we authenticate a user hence the req.login code block
//     req.login(registeredUser, (err) => {
//       if (err) return next(err);
//       req.flash("success", "Welcome to Yelp Camp!");
//       res.redirect("/campgrounds");
//     });
//   } catch (e) {
//     req.flash("error", e.message);
//     res.redirect("register");
//   }
//   //console.log(registeredUser);
//   req.flash("success", "Welcome to Yelp Camp!");
//   res.redirect("/campgrounds");
// };

// module.exports.renderLogin = (req, res) => {
//   return res.render("users/login");
// };

// module.exports.login = (req, res) => {
//   req.flash("success", "welcome back!");
//   const redirectUrl = req.session.returnTo || "/campgrounds"; // VIDEO 519 returnTO Behavior, redirect user to originalUrl
//   delete req.session.returnTo; // 519 delete returnTo from session
//   return res.redirect(redirectUrl);
// };

// module.exports.logout = (req, res) => {
//   req.logout();
//   req.flash("success", "Goodbye!");
//   return res.redirect("/campgrounds");
// };
