const User = require("../models/User");
const NotFound = require("../errors/NotFound");
const BadRequest = require("../errors/BadRequest");

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
        res.status(400).send({ message: "Некорректные данные" });
      }
      res.status(500).send({ message: "Ошибка сервера" });
    })
    .finally(next);
};

module.exports.getByIdUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFound("Пользователь с таким ID не существует");
    })
    .then(({ _id }) => {
      User.findById(_id)
        .then((user) => res.send(user))
        .catch((err) => {
          if (err.name === "CastError") {
            throw new BadRequest("Неверный ID");
          }
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.editProfile = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true, upsert: true }
  )
    .then((dataUser) => res.status(200).send(dataUser))
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        throw new BadRequest("Некорректные данные");
      }
    })
    .catch(next);
};

module.exports.editAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true, upsert: true }
  )
    .then((dataUser) => res.status(200).send(dataUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        throw new BadRequest("Ссылка на аватар не корректна");
      } else if (err.name === "CastError") {
        throw new BadRequest("Не корректный ID");
      }
    })
    .catch(next);
};
