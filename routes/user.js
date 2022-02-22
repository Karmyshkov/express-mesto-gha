const router = require('express').Router();
const controller = require('../controllers/user');

router.get('/users', controller.getAllUsers);
router.get('/users/:id', controller.getByIdUser);
router.post('/users', controller.createUser);
router.patch('/users/me', controller.editProfile);
router.patch('/users/me/avatar', controller.editAvatar);

module.exports = router;
