const { Router } = require('express');
const userController = require('../controllers/userController');
const { checkToken } = require('../middleware/authMiddleware');

const router = Router();

router.get('/signup', checkToken, userController.signup_get);
router.get('/login', checkToken, userController.login_get);
router.post('/signup', userController.signup_post);
router.post('/login', userController.login_post);
router.get('/logout', userController.logout_get);

module.exports = router;