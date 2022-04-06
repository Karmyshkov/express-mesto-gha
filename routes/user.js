const router = require('express').Router();
const {
  getAllUsers,
  getByIdUser,
  getCurrentUser,
  editProfile,
  editAvatar,
} = require('../controllers/user');
const {
  IdValidate,
  editProfileValidate,
  editAvatarValidate,
} = require('../middlewares/validation');

router.get('/users', getAllUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:id', IdValidate, getByIdUser);
router.patch('/users/me', IdValidate, editProfileValidate, editProfile);
router.patch('/users/me/avatar', IdValidate, editAvatarValidate, editAvatar);

module.exports = router;
