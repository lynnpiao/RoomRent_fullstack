const express = require('express');
const LikeController = require('../controller/LikeController');
const {toggleLike} = LikeController;
const { validateToken, validateRole } = require('../middlewares/AuthMiddleware')


const router = express.Router()

// tested
router.post('/likes', validateToken, validateRole('tenant'), toggleLike)

module.exports = router;