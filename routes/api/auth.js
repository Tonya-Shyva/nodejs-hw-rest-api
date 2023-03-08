const express = require("express");
const router = express.Router();
const { getCurrent, ctrlWrapper, upload } = require("../../middlewares");

const {
  register,
  login,
  getCurrentUser,
  updateAvatar,
  logout,
  updateSubscription,
  deleteUserByMail,
} = require("../../controllers");

router.post("/register", ctrlWrapper(register));
router.post("/login", ctrlWrapper(login));
router.get("/current", getCurrent, ctrlWrapper(getCurrentUser));
router.patch("/subscription", getCurrent, ctrlWrapper(updateSubscription));
router.patch(
  "/avatars",
  getCurrent,
  upload.single("avatar"),
  ctrlWrapper(updateAvatar)
);
router.post("/logout", getCurrent, ctrlWrapper(logout));
router.delete("/", deleteUserByMail);

module.exports = router;
