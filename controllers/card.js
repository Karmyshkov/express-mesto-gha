const Card = require('../models/Card');
const { NotFound } = require('../errors/NotFound');
const { BadRequest } = require('../errors/BadRequest');
const { ServerError } = require('../errors/ServerError');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((dataCards) => res.status(200).send(dataCards))
    .catch((err) => {
      if (err.name === 'ServerError') {
        throw new ServerError('Ошибка сервера');
      }
    })
    .finally(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((dataCard) => res.status(201).send(dataCard))
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

module.exports.deleteByIdCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .then((dataCard) => res.status(200).send(dataCard))
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFound('Нет карточки с таким id');
      }
      if (err.name === 'ServerError') {
        throw new ServerError('Ошибка сервера');
      }
    })
    .finally(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((dataCard) => res.status(200).send(dataCard))
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFound('Нет карточки с таким id');
      }
      if (err.name === 'ServerError') {
        throw new ServerError('Ошибка сервера');
      }
    })
    .finally(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((dataCard) => res.status(200).send(dataCard))
    .catch((err) => {
      if (err.name === 'NotFound') {
        throw new NotFound('Нет карточки с таким id');
      }
      if (err.name === 'ServerError') {
        throw new ServerError('Ошибка сервера');
      }
    })
    .finally(next);
};
