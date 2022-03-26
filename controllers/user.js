const User = require('../models/User');

module.exports.getAllUsers = (req, res) => {
  User.find({}).then((dataUsers) => res.status(200).send(dataUsers));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((dataUser) => res.status(201).send(dataUser))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.getByIdUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Пользователь по указанному _id не найден' });
      } else if (err.message === 'NotFound') {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.editProfile = (req, res) => {
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
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.editAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((dataUser) => res.status(200).send({ data: dataUser._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      } else if (err.name === 'CastError') {
        res
          .status(400)
          .send({ message: 'Пользователь с указанным _id не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка сервера' });
      }
    });
};
