const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const BadRequestError = require('../errors/BadRequestError');

const checkValidEmail = (value) => {
  if (!validator.isEmail(value)) {
    throw new BadRequestError('Некорректный email');
  }
  return value;
};

const checkValidURL = (value) => {
  if (!validator.isURL(value)) {
    throw new BadRequestError('Некорректный URL');
  }
  return value;
};

const createCardValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().custom(checkValidURL).required(),
  }),
});

const IdValidate = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().alphanum().length(24).hex(),
  }),
});

const loginValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().custom(checkValidEmail).required(),
    password: Joi.string().required(),
  }),
});

const createUserValidate = celebrate({
  body: Joi.object().keys({
    email: Joi.string().custom(checkValidEmail).required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(checkValidURL),
  }),
});

const editProfileValidate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
});

const editAvatarValidate = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(checkValidURL).required(),
  }),
});

module.exports = {
  createCardValidate,
  IdValidate,
  loginValidate,
  createUserValidate,
  editProfileValidate,
  editAvatarValidate,
};
