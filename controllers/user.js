const User = require('../models/User');
const { NotFound } = require('../errors/NotFound');
const { BadRequest } = require('../errors/BadRequest');
const { ServerError } = require('../errors/ServerError');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((dataUsers) => res.status(200).send(dataUsers))
    .catch((err) => {
      if (err.name === 'ServerError') {
        throw new ServerError('Ошибка сервера');
      }
    })
    .finally(next);
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((dataUser) => res.status(201).send(dataUser))
    .catch((err) => {
      if (err.name === 'BadRequest') {
        throw new BadRequest('Не корректные данные');
      }
      if (err.name === 'ServerError') {
        throw new ServerError('Ошибка сервера');
      }
    })
    .finally(next);
};

module.exports.getByIdUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((dataUser) => res.status(200).send(dataUser))
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFound('Нет пользователя с таким id');
      }
      if (err.name === 'ServerError') {
        throw new ServerError('Ошибка сервера');
      }
    })
    .finally(next);
};

module.exports.editProfile = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true, upsert: true },
  )
    .then((dataUser) => res.status(200).send(dataUser))
    .catch((err) => {
      if (err.name === 'BadRequest') {
        throw new BadRequest('Не корректные данные');
      }
      if (err.name === 'NotFound') {
        throw new NotFound('Нет пользователя с таким id');
      }
      if (err.name === 'ServerError') {
        throw new ServerError('Ошибка сервера');
      }
    })
    .finally(next);
};

module.exports.editAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true, upsert: true },
  )
    .then((dataUser) => res.status(200).send(dataUser))
    .catch((err) => {
      if (err.name === 'BadRequest') {
        throw new BadRequest('Не корректные данные');
      }
      if (err.name === 'NotFound') {
        throw new NotFound('Нет пользователя с таким id');
      }
      if (err.name === 'ServerError') {
        throw new ServerError('Ошибка сервера');
      }
    })
    .finally(next);
};
