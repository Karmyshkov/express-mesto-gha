const Card = require("../models/Card");

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((dataCards) => res.status(200).send(dataCards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((dataCard) => res.status(201).send({ data: dataCard._id }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные при создании карточки",
        });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    })
    .catch(next);
};

module.exports.deleteByIdCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .then((dataCard) => res.status(200).send(dataCard))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(404)
          .send({ message: "Карточка с указанным _id не найдена" });
      }
      res.status(500).send({ message: "Ошибка сервера" });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((dataCard) => res.status(200).send(dataCard))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные для постановки лайка",
        });
      } else if (err.name === "CastError") {
        res
          .status(404)
          .send({ message: "Передан несуществующий _id карточки" });
      }
      res.status(500).send({ message: "Ошибка сервера" });
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((dataCard) => res.status(200).send(dataCard))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({
          message: "Переданы некорректные данные для снятии лайка",
        });
      } else if (err.name === "CastError") {
        res
          .status(404)
          .send({ message: "Передан несуществующий _id карточки" });
      }
      res.status(500).send({ message: "Ошибка сервера" });
    })
    .catch(next);
};
