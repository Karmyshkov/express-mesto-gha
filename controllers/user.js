const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');
const UnauthorizedError = require('../errors/UnauthorizedError');
const ConflictError = require('../errors/ConflictError');

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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new BadRequestError('Неправильный логин или пароль');
      }
      return User.findOne({ email }, '+password');
    })
    .then((user) => {
      const matched = bcrypt.compare(password, user.password);
      return { user, matched };
    })
    .then(({ user, matched }) => {
      if (!matched) {
        throw new UnauthorizedError('Неправильный логин или пароль');
      }

      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: '7d',
      });
      res.send(token);
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
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
        .then((dataUser) => res.status(201).send(dataUser))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            throw new BadRequestError(
              'Переданы некорректные данные при создании пользователя',
            );
          }
          throw new ServerError();
        });
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
        throw new BadRequestError(
          'Переданы некорректные данные при обновлении профиля',
        );
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
        throw new BadRequestError(
          'Переданы некорректные данные при обновлении аватара',
        );
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Пользователь с указанным _id не найден');
      }
      throw new ServerError();
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
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
