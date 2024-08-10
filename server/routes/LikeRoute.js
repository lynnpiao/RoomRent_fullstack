const express = require('express');
const LikeController = require('../controller/LikeController');
const {getLikesByRoom, toggleLike} = LikeController;
const { validateToken, validateRole } = require('../middlewares/AuthMiddleware')


const router = express.Router()

// tested
router.get('/likes/:roomId', getLikesByRoom)
router.post('/likes', validateToken, validateRole('tenant'), toggleLike)

module.exports = router;