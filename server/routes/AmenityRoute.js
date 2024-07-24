const express = require('express');
const AmenityController = require('../controller/AmenityController');
const {getAmenities,
    getAmenitiesByApartment,
    getAmenitiesByRoom,
    createAmenity,
    createAmenitiesByApartment,
    createAmenitiesByRoom,
    deleteAmenity,
    deleteAmenityByApartment,
    deleteAmenityByRoom} = AmenityController;
const { validateToken, validateRole } = require('../middlewares/AuthMiddleware')


const router = express.Router()

// all tested 
router.get('/amenities', getAmenities)
router.get('/amenities/apartment/:apartmentId', getAmenitiesByApartment)
router.get('/amenities/room/:roomId', getAmenitiesByRoom)
router.post('/amenities', createAmenity)
router.post('/amenities/apartment/:apartmentId', validateToken, validateRole('manager'), createAmenitiesByApartment)
router.post('/amenities/room/:roomId', validateToken, validateRole('manager'),  createAmenitiesByRoom)
router.delete('/amenities/:id', deleteAmenity)
router.delete('/amenities/apartment/:apartmentId/:amenityId', validateToken, validateRole('manager'), deleteAmenityByApartment)
router.delete('/amenities/room/:roomId/:amenityId', validateToken, validateRole('manager'),deleteAmenityByRoom)


module.exports = router;