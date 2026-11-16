const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/appointmentController');
router.post('/', protect, authorize('patient'), c.createAppointment);
router.get('/my', protect, authorize('patient'), c.myAppointments);
router.get('/doctor', protect, authorize('doctor'), c.doctorAppointments);
router.patch('/:id/status', protect, authorize('doctor'), c.updateStatus);
router.patch('/:id/cancel', protect, authorize('patient'), c.cancelAppointment);
module.exports = router;
