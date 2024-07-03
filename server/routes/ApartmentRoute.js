const express = require('express');
const ApartmentController = require('../controller/ApartmentController');
const {
    getApartments,
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
router.get('/api/apartments', getApartments)
router.get('/api/apartments/:roomId', getApartmentByRoom) 
router.get('/api/apartments/manage/:userId', getApartmentsByManager)
router.post('/api/apartments', validateToken, validateRole('manager'), createApartment)
router.post('/api/manageapartments', validateToken, validateRole('manager'), createManageApartment)
router.put('/api/apartments/:id', validateToken, validateRole('manager'), updateApartment)
router.delete('/api/apartments/:id', validateToken, validateRole('manager'), deleteApartment)
router.delete('/api/manageapartments', validateToken, validateRole('manager'), deleteManageApartment)

module.exports = router;