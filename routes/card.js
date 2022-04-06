const router = require("express").Router();
const controller = require("../controllers/card");
const middleware = require("../middlewares/validation");

router.get("/cards", controller.getAllCards);
router.post("/cards", middleware.createCard, controller.createCard);
router.delete("/cards/:id", middleware.IdValidate, controller.deleteByIdCard);
router.put("/cards/:cardId/likes", middleware.IdValidate, controller.likeCard);
router.delete(
  "/cards/:cardId/likes",
  middleware.IdValidate,
  controller.dislikeCard
);

module.exports = router;
