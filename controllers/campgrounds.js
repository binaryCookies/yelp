//* 526 REFACTORING TO CAMPGROUNDS CONTROLLER
const Campground = require("../models/campground");
const { cloudinary } = require("../cloudinary"); //import cloudinary object to delete images from cloudinary

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};
module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  //  res.send(req.body); // testing post route
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  })); //VIDEO 536 - map over array in req object provided from multer save filenames and path of images uploaded
  campground.author = req.user._id; // VIDEO 520 Adding Author to Campground
  await campground.save();
  console.log(campground);
  // Video 493 Setting up Flash - added to our template to display flash msg - defined a middleware in app.js
  req.flash("success", "Successfully made a new campground");
  return res.redirect(`/campgrounds/${campground._id}`);
  // console.dir(req);
  // console.log(req.body.campground);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews", // VIDEO 525 - added nested populate, path: author
      populate: {
        path: "author",
      },
    })
    .populate("author");
  //   console.log(campground); // print to test if author and username show
  //* Video 495 Flash Error Partial - flash msg if campground not found
  if (!campground) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
  // console.log(campground);
};
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id); // Step 1 find campground by id
  if (!campground) {
    req.flash("error", "Cannot find that campground"); // Video 495 Flash Error Partial - flash msg if campground not found
    return res.redirect("/campgrounds");
  }
  // if (!campground.author.equals(req.user._id)) { // muted video 523
  //   Step 2 Verify if current user is author of the campground
  //   req.flash("error", "You do not have permission to do that");
  //   return res.redirect(`/campgrounds/${id}`); // Step 3 redirect to show page
  // }

  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body); //Video 542: to see whats going on with delete checkbox data
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    //to make an array
    url: f.path,
    filename: f.filename,
  }));

  campground.images.push(...imgs); // push data from array (not array itself) & to not ovewrite and to pass mongoose validation
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename); //to destroy filename, destroy = cloudinary method
    }
    await campground.updateOne({
      //Query mongodb: to delete image in array that matches filename in deleteImages
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  //* Video 494 Flash Success partial - flash update msg
  req.flash("success", "Successfully updated the campground");
  res.redirect(`/campgrounds/${campground._id}`);
  // res.send("it worked");
};

module.exports.deleteCampground = async (req, res) => {
  // res.send("it worked");
  const { id } = req.params;
  // console.log(req.params);
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};
