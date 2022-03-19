const router = require('express').Router();
const controller = require('../controllers/card');

router.get('/cards', controller.getAllCards);
router.post('/cards', controller.createCard);
router.delete('/cards/:id', controller.deleteByIdCard);
router.put('/cards/:cardId/likes', controller.likeCard);
router.delete('/cards/:cardId/likes', controller.dislikeCard);

module.exports = router;
