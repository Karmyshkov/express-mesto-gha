const Card = require('../models/Card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ServerError = require('../errors/ServerError');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((dataCards) => res.status(200).send(dataCards))
    .catch((err) => {
      if (err) {
        throw new ServerError();
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((dataCard) => res.status(201).send({ data: dataCard._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      } else {
        throw new ServerError();
      }
    })
    .catch(next);
};

module.exports.deleteByIdCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((dataCard) => res.status(200).send(dataCard))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Карточка с указанным _id не найдена');
      } else if (err.message === 'NotFound') {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } else {
        throw new ServerError();
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((dataCard) => res.status(200).send({ data: dataCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан несуществующий _id карточки');
      } else if (err.message === 'NotFound') {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } else {
        throw new ServerError();
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((dataCard) => res.status(200).send({ data: dataCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан несуществующий _id карточки');
      } else if (err.message === 'NotFound') {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      } else {
        throw new ServerError();
      }
    })
    .catch(next);
};
