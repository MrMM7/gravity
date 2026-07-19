const router = require('express').Router();
const {createNewLink, getLink} = require('./controller')

router.post('/', createNewLink);
router.get('/:shortCode', getLink);

module.exports = router;