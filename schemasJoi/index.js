const {
  contactPostValidator,
  contactPutValidator,
  favoriteJoiSchema,
} = require("./contactsValidation");

const {
  userRegJoiSchema,
  userVerifyJoiSchema,
  userLoginJoiSchema,
  userUpdateSchema,
} = require("./userValidation");

module.exports = {
  userRegJoiSchema,
  userVerifyJoiSchema,
  userLoginJoiSchema,
  userUpdateSchema,
  contactPostValidator,
  contactPutValidator,
  favoriteJoiSchema,
};
