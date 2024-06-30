const express = require('express');
const AmenityController = require('../controller/AmenityController');
const {getAmenities,
    getAmenitiesByApartment,
    getAmenitiesByRoom,
    createAmenities,
    createAmenitiesByApartment,
    createAmenitiesByRoom,
    deleteAmenities,
    deleteAmenityByApartment,
    deleteAmenityByRoom} = AmenityController;


const router = express.Router()


router.get('/api/amenities', getAmenities)
router.get('/api/amenities/apartment/:apartmentId', getAmenitiesByApartment)
router.get('/api/amenities/room/:roomId', getAmenitiesByRoom)
router.post('/api/amenities', createAmenities)
router.post('/api/amenities/apartment/:apartmentId', createAmenitiesByApartment)
router.post('/api/amenities/room/:roomId', createAmenitiesByRoom)
router.delete('/api/apartments', deleteAmenities)
router.delete('/api/apartments/apartment/:apartmentId/:amenityId', deleteAmenityByApartment)
router.delete('/api/apartments/room/:roomId/:amenityId', deleteAmenityByRoom)


module.exports = router;