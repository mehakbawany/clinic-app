const mongoose = require('mongoose');
const User = require('../models/User');

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.getDoctors = async (req, res, next) => {
  try {
    const filter = { role: 'doctor', isActive: true };
    const search = (req.query.search || '').trim();
    if (search) {
      const rx = new RegExp(escape(search), 'i');
      filter.$or = [{ name: rx }, { specialization: rx }];
    }
    res.json(await User.find(filter).sort({ name: 1 }));
  } catch (e) {
    next(e);
  }
};

exports.getDoctor = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid doctor id' });
    const doctor = await User.findOne({ _id: req.params.id, role: 'doctor', isActive: true });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (e) {
    next(e);
  }
};
