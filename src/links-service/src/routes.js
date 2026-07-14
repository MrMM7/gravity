const router = require('express').Router();
const {createNewLink, getLink} = require('./controller')

router.post('/', (req, res, next) => {
    console.log("POST / route matched");
    next();
}, createNewLink);
router.get('/:shortCode', getLink);

module.exports = router;