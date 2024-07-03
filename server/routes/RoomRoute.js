const express = require('express');
const RoomController = require('../controller/RoomController');
const {getRooms,
    getRoomById,
    getRoomsByApartment,
    getRoomsByAmenities,
    getRoomsByAttributes,
    createRoom,
    updateRoom,
    deleteRoom} = RoomController;
const { validateToken, validateRole } = require('../middlewares/AuthMiddleware')


const router = express.Router()

// getRoomsByAmenities and getRoomsByAttributes not tested
router.get('/api/rooms', getRooms)
router.get('/api/rooms/:id', getRoomById)
router.get('/api/rooms/apartment/:apartmentId', getRoomsByApartment)
router.get('/api/rooms/amenities', getRoomsByAmenities)
router.get('/api/rooms/attributes', getRoomsByAttributes)
router.post('/api/rooms', validateToken, validateRole('manager'), createRoom)
router.put('/api/rooms/:id', validateToken, validateRole('manager'), updateRoom)
router.delete('/api/rooms/:id',validateToken, validateRole('manager'), deleteRoom)

module.exports = router;