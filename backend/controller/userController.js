const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");
const cloudinary = require("cloudinary");

const signup = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  const myCloud = await cloudinary.v2.uploader.upload(req.body.pic, {
    folder: "profilePic",
    width: 150,
    crop: "scale",
  });

  console.log("1")

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const exsist = await User.findOne({ email });

  if (exsist) {
    res.status(400);
    throw new Error("User already exsist");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic: myCloud.secure_url,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to register User.");
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to Login");
  }
});

const allUsers = asyncHandler(async (req, res) => {
  const key = req.query.search
    ? {
        $or: [{ name: { $regex: req.query.search, $options: "i" } }],
      }
    : {};
  const users = await User.find(key).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { signup, login, allUsers };
