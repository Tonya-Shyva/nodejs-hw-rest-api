const {
  listContacts,
  getById,
  removeContact,
  updateContact,
  addContact,
  updateStatusContact,
} = require("./contacts");

const {
  register,
  verifyEmail,
  resendVerifyEmail,
  login,
  getCurrentUser,
  logout,
  deleteUserByMail,
  updateSubscription,
  updateAvatar,
} = require("./users");

module.exports = {
  register,
  verifyEmail,
  resendVerifyEmail,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatar,
  deleteUserByMail,
  listContacts,
  getById,
  removeContact,
  updateContact,
  addContact,
  updateStatusContact,
};
