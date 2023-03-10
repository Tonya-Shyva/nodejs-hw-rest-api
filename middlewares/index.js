const ctrlWrapper = require("./controllerWrapper");
const getCurrent = require("./auth");
const upload = require("./upload");
const validator = require("./validator");

module.exports = { getCurrent, validator, ctrlWrapper, upload };
