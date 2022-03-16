const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//Installed dotenv
//Installed dependancies cloudinary & multer-storage-cloudinary
//VIDEO 535 UPLOADING CLOUDINARY BASICS - questions: see cludinary packages docs
//after below steps change current route from saving images to local storage to cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

//pass in cloudinary object we just configured with our credientials and then upload to YelpCamp folder
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "YelpCamp", //fixed Vid 536: folder in cloudinary where we store things in
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

//Export to cludinary instance we just configured and storage
module.exports = {
  cloudinary,
  storage,
};
