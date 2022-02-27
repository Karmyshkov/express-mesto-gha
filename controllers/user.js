const User = require("../models/User");

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((dataUsers) => res.status(200).send(dataUsers))
    .catch(next);
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
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании пользователя",
        });
      }
      res.status(500).send({ message: "Ошибка сервера" });
    })
    .finally(next);
};

module.exports.getByIdUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      res.status(404).send({ message: "Некорректный ID" });
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({ message: "Пользователь по указанному _id не найден" });
      }
      res.status(500).send({ message: "Ошибка сервера" });
    })
    .catch(next);
};

module.exports.editProfile = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    id,
    {
      $set: {
        name,
        about,
      },
    },
    { new: true, runValidators: true }
  )
    .then((dataUser) => res.status(200).send({ data: dataUser }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при обновлении профиля",
        });
      } else if (err.name === "CastError") {
        res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден" });
      }
      res.status(500).send({ message: "Ошибка сервера" });
    })
    .catch(next);
};

module.exports.editAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .then((dataUser) => res.status(200).send({ data: dataUser }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при обновлении аватара",
        });
      } else if (err.name === "CastError") {
        res
          .status(404)
          .send({ message: "Пользователь с указанным _id не найден" });
      }
      res.status(500).send({ message: "Ошибка сервера" });
    })
    .catch(next);
};
