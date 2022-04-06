const router = require("express").Router();
const controller = require("../controllers/user");
const middleware = require("../middlewares/validation");

router.get("/users", controller.getAllUsers);
router.get("/users/:id", middleware.IdValidate, controller.getByIdUser);
router.get("/users/me", controller.getCurrentUser);
router.patch(
  "/users/me",
  middleware.editProfileValidate,
  controller.editProfile
);
router.patch(
  "/users/me/avatar",
  middleware.editAvatarValidate,
  controller.editAvatar
);

module.exports = router;
