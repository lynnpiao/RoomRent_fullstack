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


const router = express.Router()


router.get('/api/rooms', getRooms)
router.get('/api/rooms/:id', getRoomById)
router.get('/api/rooms/apartment/:apartmentId', getRoomsByApartment)
router.get('/api/rooms/amenities', getRoomsByAmenities)
router.get('/api/rooms/attributes', getRoomsByAttributes)
router.post('/api/rooms', createRoom)
router.put('/api/rooms/:id', updateRoom)
router.delete('/api/rooms/:id', deleteRoom)

module.exports = router;