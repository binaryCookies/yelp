//* VIDEO 512 REGISTER - POST request route for registering user, GET request to show form, GET request to login, POST request login to login, and, logout

const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post("/register", async (req, res) => {
  res.send(req.body);
});
module.exports = router;
