const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  screenName: String,
  googleId: String,
  role: Object
});

const User = mongoose.model("user", userSchema);

module.exports = User;
