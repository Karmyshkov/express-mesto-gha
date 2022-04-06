const { celebrate, Joi, CelebrateError } = require("celebrate");
const validator = require("validator");
const BadRequestError = require("../errors/BadRequestError");

const checkValidURL = (value) => {
  if (!validator.isURL(value)) {
    throw new BadRequestError("Некорректный URL");
  }
  return value;
};

const createCardValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(checkValidURL).required(),
  }),
});

module.exports = {
  createCardValidate,
};
