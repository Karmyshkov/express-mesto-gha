const router = require('express').Router();
const {
  getAllCards,
  createCard,
  deleteByIdCard,
  likeCard,
  dislikeCard,
} = require('../controllers/card');
const { createCardValidate, cardIdValidate } = require('../middlewares/validation');

router.get('/cards', getAllCards);
router.post('/cards', createCardValidate, createCard);
router.delete('/cards/:cardId', cardIdValidate, deleteByIdCard);
router.put('/cards/:cardId/likes', cardIdValidate, likeCard);
router.delete('/cards/:cardId/likes', cardIdValidate, dislikeCard);

module.exports = router;
