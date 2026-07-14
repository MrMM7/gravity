const router = require("express").Router()
const {
    createNewUser,
    login,
    verifySession
} = require('./controllers');

router.post('/register', createNewUser)
router.post('/login', login);
router.get('/verify', verifySession);

module.exports = router;