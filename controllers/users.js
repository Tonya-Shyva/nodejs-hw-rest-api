const bcrypt = require("bcrypt");
const { uid } = require("uid");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { SECRET_KEY } = process.env;
const { User } = require("../models");
const {
  userRegJoiSchema,
  userLoginJoiSchema,
  userUpdateSchema,
} = require("../schemasJoi");

const register = async (req, res) => {
  const { error } = userRegJoiSchema(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: "Error from Joi or other validation library" });
  }
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({ message: "Email in use" });
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
  if (error || Object.keys(req.body) === 0) {
    return res
      .status(400)
      .json({ message: "Error from Joi or other validation library" });
  }
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  const passCompare = await bcrypt.compare(password, user.password);
  if (!user || !passCompare) {
    return res.status(401).json({ message: "Email or password is wrong" });
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
  const avatarDir = path.join(__dirname, "../", "public", "avatars");
  const { _id } = req.user;

  if (!req.file) {
    return res.status(400).json({ message: "There is no file" });
  }

  const { path: tempUpload, originalname } = req.file;
  const imageName = `${uid(8)}_${originalname}`;

  try {
    const imgProcessed = await Jimp.read(tempUpload);
    await imgProcessed
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER || Jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(tempUpload);

    const resultUpload = path.join(avatarDir, imageName);
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
