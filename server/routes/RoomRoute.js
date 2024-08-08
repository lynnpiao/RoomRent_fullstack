const express = require('express');
const RoomController = require('../controller/RoomController');
const {getRooms,
    getAllRooms,
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
router.get('/rooms', getRooms)
router.get('/rooms/all', getAllRooms)
router.get('/rooms/:id', getRoomById)
router.get('/rooms/apartment/:apartmentId', getRoomsByApartment)
router.post('/rooms/amenities', getRoomsByAmenities)
router.post('/rooms/attributes', getRoomsByAttributes)
router.post('/rooms', validateToken, validateRole('manager'), createRoom)
router.put('/rooms/:id', validateToken, validateRole('manager'), updateRoom)
router.delete('/rooms/:id',validateToken, validateRole('manager'), deleteRoom)

module.exports = router;