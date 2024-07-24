const express = require('express');
const UserController = require('../controller/UserController');
const { validateToken } = require('../middlewares/AuthMiddleware')

const {createAccount, loginAccount, auth} = UserController;

const router = express.Router()

// all tested
router.post('/user', createAccount)
router.post('/user/login', loginAccount)
router.get('/user/auth', validateToken, auth)

module.exports = router;