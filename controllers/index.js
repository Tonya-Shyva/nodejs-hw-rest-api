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
  listContacts,
  getById,
  removeContact,
  updateContact,
  addContact,
  updateStatusContact,
};
