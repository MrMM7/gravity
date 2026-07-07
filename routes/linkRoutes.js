const router = require('express').Router();
const {createNewLink, getLink} = require('../controllers/linkController')
const verifySession = require('../middlewares/auth');

router.post('/api/links', verifySession, createNewLink);
router.get('/:shortCode', getLink);

module.exports = router;