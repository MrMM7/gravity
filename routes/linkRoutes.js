const router = require('express').Router();
const {createNewLink, getLink} = require('../controllers/linkController')

router.post('/links', createNewLink);
router.get('/:shortCode', getLink);

module.exports = router;