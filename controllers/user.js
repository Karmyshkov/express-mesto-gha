const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV = 'development', SECRET_KEY } = process.env;

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((dataUsers) => res.status(200).send(dataUsers))
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'development' ? 'SECRET_KEY_TEST' : SECRET_KEY,
        {
          expiresIn: '7d',
        },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ message: 'Успешная авторизация' });
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(`Пользователь с ${email} существует`);
      }
    })
    .then(() => {
      bcrypt
        .hash(password, 10)
        .then((hash) => User.create({
          email,
          password: hash,
          name,
          about,
          avatar,
        }))
        .then((dataUser) => res.status(201).send({
          data: {
            name: dataUser.name,
            about: dataUser.about,
            avatar: dataUser.avatar,
            email: dataUser.email,
          },
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequestError(
              'Переданы некорректные данные при создании пользователя',
            );
          }
        });
    })
    .catch(next);
};

const getByIdUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Пользователь по указанному _id не найден');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const editProfile = (req, res, next) => {
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
        throw new BadRequestError(
          'Переданы некорректные данные при обновлении профиля',
        );
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Пользователь с указанным _id не найден');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const editAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((dataUser) => res.status(200).send({ data: dataUser }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при обновлении аватара',
        );
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Пользователь с указанным _id не найден');
      } else {
        next(err);
      }
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new BadRequestError('Пользователь с указанным _id не найден');
    })
    .then((user) => {
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь с указанным _id не найден'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllUsers,
  getCurrentUser,
  editAvatar,
  editProfile,
  getByIdUser,
  createUser,
  login,
};
