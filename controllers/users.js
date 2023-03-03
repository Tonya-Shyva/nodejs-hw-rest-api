const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");

const { SECRET_KEY } = process.env;
const { HttpError } = require("../middlewares");
const { User } = require("../models");
const {
  userRegJoiSchema,
  userLoginJoiSchema,
  userUpdateSchema,
} = require("../schemasJoi");

const register = async (req, res) => {
  const { error } = userRegJoiSchema(req.body);
  if (error) {
    throw HttpError(400, "Error from Joi or other validation library");
  }
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const result = await User.create({
    email,
    password: hashPassword,
    subscription,
    avatarURL,
  });
  res.status(201).json({ email, subscription, avatarURL });
};

const login = async (req, res) => {
  const { error } = userLoginJoiSchema(req.body);
  if (error) {
    throw HttpError(400, "Error from Joi or other validation library");
  }
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const passCompare = await bcrypt.compare(password, user.password);
  if (!user || !passCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "12h" });
  await User.findByIdAndUpdate(user._id, { token });
  res
    .status(200)
    .json({ token, user: { email, subscription: user.subscription } });
};

const getCurrentUser = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};
const updateSubscription = async (req, res) => {
  const { _id, email } = req.user;
  const { error } = userUpdateSchema(req.body);

  if (error) {
    res
      .status(400)
      .json({ message: "Missing or invalid field 'subscription'" });
  }
  const { subscription } = req.body;
  const result = await User.updateOne(
    { _id, subscription },
    {
      new: true,
    }
  );
  if (!result) {
    return res.status(404).json({ message: "Update is in failure" });
  }
  return res.status(200).json({
    user: {
      _id,
      email,
      subscription,
    },
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const imageName = `${_id}_${originalname}`;

  try {
    const resultUpload = path.join(
      __dirname,
      "../",
      "public",
      "avatars",
      imageName
    );
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("public", "avatars", imageName);
    await User.findByIdAndUpdate(_id, { avatarURL });
    res.status(200).json({ avatarURL });
  } catch (err) {
    await fs.unlink(tempUpload);
    throw err;
  }
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json({ message: "Log out" });
};

module.exports = {
  register,
  login,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  logout,
};
