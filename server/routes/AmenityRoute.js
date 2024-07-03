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
router.get('/api/amenities', getAmenities)
router.get('/api/amenities/apartment/:apartmentId', getAmenitiesByApartment)
router.get('/api/amenities/room/:roomId', getAmenitiesByRoom)
router.post('/api/amenities', createAmenity)
router.post('/api/amenities/apartment/:apartmentId', validateToken, validateRole('manager'), createAmenitiesByApartment)
router.post('/api/amenities/room/:roomId', validateToken, validateRole('manager'),  createAmenitiesByRoom)
router.delete('/api/amenities/:id', deleteAmenity)
router.delete('/api/amenities/apartment/:apartmentId/:amenityId', validateToken, validateRole('manager'), deleteAmenityByApartment)
router.delete('/api/amenities/room/:roomId/:amenityId', validateToken, validateRole('manager'),deleteAmenityByRoom)


module.exports = router;