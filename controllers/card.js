const Card = require("../models/Card");

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((dataCards) => res.status(200).send(dataCards))
    .catch(() => res.status(500).send({ message: "Произошла ошибка" }));
};

module.exports.createCard = (req, res) => {
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
    });
};

module.exports.deleteByIdCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then((dataCard) => res.status(200).send(dataCard))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({ message: "Карточка с указанным _id не найдена" });
      } else if (err.message === "NotFound") {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then((dataCard) => res.status(200).send({ data: dataCard }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({ message: "Передан несуществующий _id карточки" });
      } else if (err.message === "NotFound") {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then((dataCard) => res.status(200).send({ data: dataCard }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({ message: "Передан несуществующий _id карточки" });
      } else if (err.message === "NotFound") {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send({ message: "Ошибка сервера" });
      }
    });
};
