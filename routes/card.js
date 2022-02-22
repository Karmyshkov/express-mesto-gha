const router = require('express').Router();
const controller = require('../controllers/card');

router.get('/card', controller.getAllCards);
router.post('/card', controller.createCard);
router.delete('/card/:id', controller.deleteByIdCard);
router.put('/card/:cardId/likes', controller.likeCard);
router.delete('/card/:cardId/likes', controller.dislikeCard);

module.exports = router;
