const express = require('express');
const ExternalAPIController = require('../controller/ExternalAPIController');
const { getApartmentImage
   } = ExternalAPIController;

const router = express.Router()


router.post('/apartment_image', getApartmentImage)


module.exports = router;