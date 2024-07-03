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

//all tested
router.get('/api/rooms', getRooms)
router.get('/api/rooms/:id', getRoomById)
router.get('/api/rooms/apartment/:apartmentId', getRoomsByApartment)
router.post('/api/rooms/amenities', getRoomsByAmenities)
router.post('/api/rooms/attributes', getRoomsByAttributes)
router.post('/api/rooms', validateToken, validateRole('manager'), createRoom)
router.put('/api/rooms/:id', validateToken, validateRole('manager'), updateRoom)
router.delete('/api/rooms/:id',validateToken, validateRole('manager'), deleteRoom)

module.exports = router;