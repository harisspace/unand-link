const { Router } = require('express');
const linkController = require('../controllers/linkController');

const router = Router();

router.get('/', linkController.home_get);

module.exports = router;
