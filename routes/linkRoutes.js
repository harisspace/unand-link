const { Router } = require('express');
const linkController = require('../controllers/linkController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = Router();

router.get('/', requireAuth, linkController.home_get);
router.post('/shortUrl', requireAuth, linkController.shortUrl_post);
router.get('/my-links', requireAuth, linkController.myLinks_get);
router.get('/redirect/:shortLink', linkController.shortUrl_get);
router.delete('/delete/:id', requireAuth, linkController.link_delete);

module.exports = router;
