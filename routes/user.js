const router = require('express').Router();
const {
  getAllUsers,
  getByIdUser,
  getCurrentUser,
  editProfile,
  editAvatar,
} = require('../controllers/user');
const {
  userIdValidate,
  editProfileValidate,
  editAvatarValidate,
} = require('../middlewares/validation');

router.get('/users', getAllUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', userIdValidate, getByIdUser);
router.patch('/users/me', userIdValidate, editProfileValidate, editProfile);
router.patch('/users/me/avatar', userIdValidate, editAvatarValidate, editAvatar);

module.exports = router;
