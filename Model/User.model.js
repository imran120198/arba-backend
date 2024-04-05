const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  fullName: String,
  userName: String,
  email: String,
  password: String,
  avatar: String,
});

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel,
};
