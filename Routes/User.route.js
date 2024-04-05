const { Router } = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { UserModel } = require("../Model/User.model");
const { authentication } = require("../Middleware/Authentication");

const UserRouter = Router();

UserRouter.post("/signup", async (req, res) => {
  const { fullName, userName, email, password, avatar } = req.body;
  const result = await UserModel.findOne({ email });
  if (result) {
    res.status(201).send({ message: "Email Already Exist" });
  } else {
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.status(500).send({ message: "Something wrong with signup", err });
      } else {
        const newSignup = new UserModel({
          fullName: fullName,
          userName: userName,
          email: email,
          password: hash,
          avatar: avatar,
        });
        const saveSignup = newSignup.save();
        res.status(201).send({ message: "Signup Successfully" });
      }
    });
  }
});

UserRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  const hash = user.password;

  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: "Something wrong with login", err });
    }
    if (result) {
      const expiresIn = "1d";
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
        expiresIn,
      });
      res.status(201).send({ message: "Login Successful", token });
    } else {
      res.status(500).send({ message: "Invalid Credential" });
    }
  });
});

UserRouter.patch("/update/:id",authentication, async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const user = await UserModel.findByIdAndUpdate(id, data, { new: true });
  if (!user) {
    res.status(500).send({ message: "Error in Update" });
  } else {
    res.status(201).send({ message: "User Updated", user });
  }
});

UserRouter.patch("/changepassword/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { email, password, newPassword } = req.body;

    let exsitingUser = await UserModel.findOne({ email: email });
    if (!exsitingUser) {
      res.status(500).send({ message: "Wrong Email" });
    }
    if (exsitingUser.password !== password) {
      res.status(500).send({ message: "Incorrect Password" });
    }
    await UserModel.findByIdAndUpdate(id, { password: newPassword });
    res.status(200).send({ message: "Password Change Successfully" });
  }
   catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = {
  UserRouter,
};
