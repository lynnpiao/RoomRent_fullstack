const express = require('express');
const ApartmentController = require('../controller/ApartmentController');
const {getApartmentByRoom,
      getApartmentsByManager,
      createApartment,
      updateApartment,
      deleteApartment} = ApartmentController;


const router = express.Router()


router.get('/api/apartments/:roomId', getApartmentByRoom)
router.get('/api/apartments/manage/:managerId', getApartmentsByManager)
router.post('/api/apartments', createApartment)
router.put('/api/apartments/:id', updateApartment)
router.delete('/api/apartments/:id', deleteApartment)

module.exports = router;