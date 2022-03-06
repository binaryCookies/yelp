//* VIDEO 510 CREATING OUR USER MODEL
//* DOCS passport-local-mongoose: https://github.com/saintedlama/passport-local-mongoose
//* DOCS passport-local: https://github.com/jaredhanson/passport-local

const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});
//* Will addon to our schema username, field for password, ensure usernames are unique and give us additonal methods we can use
UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", UserSchema);
