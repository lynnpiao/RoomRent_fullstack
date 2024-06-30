const express = require('express');
const LikeController = require('../controller/LikeController');
const {toggleLike} = LikeController;


const router = express.Router()

router.post('/api/likes', toggleLike)

module.exports = router;