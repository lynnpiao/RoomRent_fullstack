const express = require('express');
const RoomController = require('../controller/RoomController');
const {getRooms,
    getAllRooms,
    getRoomById,
    getRoomsByApartment,
    getRoomsByLikes,
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
router.get('/rooms/user/:userId', getRoomsByLikes)
router.post('/rooms/amenities', getRoomsByAmenities) // not use 
router.post('/rooms/attributes', getRoomsByAttributes) // not use
router.post('/rooms', validateToken, validateRole('manager'), createRoom)
router.put('/rooms/:id', validateToken, validateRole('manager'), updateRoom)
router.delete('/rooms/:id',validateToken, validateRole('manager'), deleteRoom)

module.exports = router;