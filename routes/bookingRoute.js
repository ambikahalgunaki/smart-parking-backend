const express = require('express');
const router = express.Router();
const { VehicleEntry, VehicleExit, getAllBookings } = require('../controllers/bookingController');

router.get('/', getAllBookings);
router.post('/', VehicleEntry);
router.put('/exit/:id', VehicleExit);


module.exports = router;