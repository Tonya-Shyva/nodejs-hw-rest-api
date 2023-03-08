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
  login,
  getCurrentUser,
  logout,
  deleteUserByMail,
  updateSubscription,
  updateAvatar,
} = require("./users");

module.exports = {
  register,
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
