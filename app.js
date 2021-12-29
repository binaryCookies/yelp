//* YELP - CODE ALONG - Start with git
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("HELLO FROM YELP CAMPGROUND");
});

app.listen(3000, (req, res) => {
  console.log("SERVING ON PORT 3000");
});
