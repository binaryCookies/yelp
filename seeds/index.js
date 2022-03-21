//? CREATED INDEX.JS VIDEO 409
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("DATABASE CONNECTED");
});

//? VIDEO 409 testing data
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: "6227474d4b6d6e257f2cfc84", // VIDEO 519 - run: node seeds/index
      location: `${cities[random1000].city},  ${cities[random1000].state}`,
      //? VIDEO 409 testing data
      title: `${sample(descriptors)} ${sample(places)}`,
      //? VIDEO 427 Adding Images (modified model to match)
      // image: "https://source.unsplash.com/collection/483251",
      images: [
        {
          url: "https://res.cloudinary.com/dpmninzv7/image/upload/v1647452902/YelpCamp/nguebxxxdjcwl2anx5nj.jpg",
          filename: "YelpCamp/nguebxxxdjcwl2anx5nj",
        },
      ],
      description:
        " Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque velit, nemo maiores nesciunt voluptas perferendis cupiditate quia facere! Quas modi ullam rem quos enim voluptates? Natus assumenda alias architecto culpa.",
      price,
      geometry: {
        type: "Point",
        coordinates: [-113.1331, 47.0202],
      },
    });
    await camp.save();
  }
  //test cnnection
  //   const c = new Campground({ title: "purple field" });
  //   await c.save();
};

seedDB().then(() => {
  mongoose.connection.close();
});
