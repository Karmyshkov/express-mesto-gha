const Card = require('../models/Card');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ServerError = require('../errors/ServerError');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((dataCards) => res.status(200).send(dataCards))
    .catch((err) => {
      if (err) {
        throw new ServerError();
      }
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((dataCard) => res.status(201).send({ data: dataCard._id }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при создании карточки',
        );
      }
      throw new ServerError();
    })
    .catch(next);
};

const deleteByIdCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав');
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .orFail(() => {
          throw new NotFoundError('Карточка с указанным _id не найдена');
        })
        .then((dataCard) => {
          if (dataCard.owner.toString() !== req.user._id) {
            throw new ForbiddenError('Нет прав');
          }
          res.status(200).send(dataCard);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Карточка с указанным _id не найдена');
      }
      throw new ServerError();
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((dataCard) => res.status(200).send({ data: dataCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан несуществующий _id карточки');
      }
      throw new ServerError();
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточка с указанным _id не найдена');
    })
    .then((dataCard) => res.status(200).send({ data: dataCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Передан несуществующий _id карточки');
      }
      throw new ServerError();
    })
    .catch(next);
};

module.exports = {
  getAllCards,
  createCard,
  deleteByIdCard,
  likeCard,
  dislikeCard,
};
