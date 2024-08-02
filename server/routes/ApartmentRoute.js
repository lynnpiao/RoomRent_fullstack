const express = require('express');
const ApartmentController = require('../controller/ApartmentController');
const {
    getApartments,
    getApartmentById,
    getApartmentByRoom,
    getApartmentsByManager,
    createApartment,
    updateApartment,
    deleteApartment,
    createManageApartment,
    deleteManageApartment } = ApartmentController;
const { validateToken, validateRole } = require('../middlewares/AuthMiddleware')

const router = express.Router()


// all tested
router.get('/apartments', getApartments)
router.get('/apartments/:id', getApartmentById) 
router.get('/apartments/room/:roomId', getApartmentByRoom) 
router.get('/apartments/manage/:userId', getApartmentsByManager)
router.post('/apartments', validateToken, validateRole('manager'), createApartment)
router.post('/manageapartments', validateToken, validateRole('manager'), createManageApartment)
router.put('/apartments/:id', validateToken, validateRole('manager'), updateApartment)
router.delete('/apartments/:id', validateToken, validateRole('manager'), deleteApartment)
router.delete('/manageapartments', validateToken, validateRole('manager'), deleteManageApartment)

module.exports = router;