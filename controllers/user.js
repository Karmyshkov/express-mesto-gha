const User = require('../models/User');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((dataUsers) => res.status(200).send(dataUsers))
    .catch((err) => {
      if (err) {
        throw new ServerError();
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;
  User.create({
    email,
    password,
    name,
    about,
    avatar,
  })
    .then((dataUser) => res.status(201).send(dataUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      }
      throw new ServerError();
    })
    .catch(next);
};

module.exports.getByIdUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Пользователь по указанному _id не найден');
      } else if (err.message === 'NotFound') {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      throw new ServerError();
    })
    .catch(next);
};

module.exports.editProfile = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    id,
    {
      name,
      about,
    },
    { new: true, runValidators: true },
  )
    .then((dataUser) => res.status(200).send({ data: dataUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении профиля');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Пользователь с указанным _id не найден');
      }
      throw new ServerError();
    })
    .catch(next);
};

module.exports.editAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((dataUser) => res.status(200).send({ data: dataUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при обновлении аватара');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Пользователь с указанным _id не найден');
      }
      throw new ServerError();
    })
    .catch(next);
};
