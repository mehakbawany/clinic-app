const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getDoctors, getDoctor } = require('../controllers/doctorController');
router.get('/', protect, getDoctors);
router.get('/:id', protect, getDoctor);
module.exports = router;
