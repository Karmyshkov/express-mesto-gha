const router = require("express").Router();
const {
  getAllCards,
  createCard,
  deleteByIdCard,
  likeCard,
  dislikeCard,
} = require("../controllers/card");
const { createCardValidate, IdValidate } = require("../middlewares/validation");

router.get("/cards", getAllCards);
router.post("/cards", createCardValidate, createCard);
router.delete("/cards/:id", IdValidate, deleteByIdCard);
router.put("/cards/:cardId/likes", IdValidate, likeCard);
router.delete("/cards/:cardId/likes", IdValidate, dislikeCard);

module.exports = router;
