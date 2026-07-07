const router = require("express").Router()
const {
    createNewUser,
    login
} = require('../controllers/authController');

router.post('/register', createNewUser)
router.post('/login', login);

module.exports = router;