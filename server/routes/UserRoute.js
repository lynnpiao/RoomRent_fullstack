const express = require('express');
const UserController = require('../controller/UserController');
const { validateToken } = require('../middlewares/AuthMiddleware')

const {createAccount, loginAccount, auth} = UserController;

const router = express.Router()

// all test in postman, works fine
router.post('/api/user', createAccount)
router.post('/api/user/login', loginAccount)
router.get('/api/user/auth', validateToken, auth)

module.exports = router;