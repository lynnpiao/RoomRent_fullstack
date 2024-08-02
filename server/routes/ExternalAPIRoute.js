const express = require('express');
const ExternalAPIController = require('../controller/ExternalAPIController');
const { getApartmentImage, getApartmentMap
   } = ExternalAPIController;

const router = express.Router()


router.post('/apartment_image', getApartmentImage)
router.post('/apartment_map', getApartmentMap)


module.exports = router;