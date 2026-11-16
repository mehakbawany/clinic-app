const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');

const emailRe = /^\S+@\S+\.\S+$/;

exports.getUsers = async (req, res, next) => {
  try {
    const filter = req.query.role ? { role: req.query.role } : {};
    res.json(await User.find(filter).sort({ createdAt: -1 }));
  } catch (e) {
    next(e);
  }
};

exports.createDoctor = async (req, res, next) => {
  try {
    const { name, email, password, specialization, experience } = req.body;
    if (!name || !name.trim() || !emailRe.test(email || '') || !password || password.length < 6 || !specialization || !specialization.trim()) {
      return res.status(400).json({ message: 'Name, valid email, password (min 6) and specialization are required' });
    }
    const exp = Number(experience);
    if (!Number.isFinite(exp) || exp < 0) return res.status(400).json({ message: 'Experience must be a number of years (0 or more)' });
    if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email is already registered' });
    const doctor = await User.create({ name: name.trim(), email, password, role: 'doctor', specialization: specialization.trim(), experience: exp });
    res.status(201).json(doctor);
  } catch (e) {
    next(e);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user id' });
    if (String(id) === String(req.user._id)) return res.status(400).json({ message: 'You cannot delete your own account' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Admin accounts cannot be deleted' });
    await Appointment.deleteMany({ $or: [{ patient: id }, { doctor: id }] });
    await user.deleteOne();
    res.json({ message: 'User deleted' });
  } catch (e) {
    next(e);
  }
};

// PATCH /api/admin/users/:id/active  -> toggles isActive
exports.toggleActive = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: 'Invalid user id' });
    if (String(id) === String(req.user._id)) return res.status(400).json({ message: 'You cannot deactivate your own account' });
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json(user);
  } catch (e) {
    next(e);
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    res.json(
      await Appointment.find()
        .populate('patient', 'name email')
        .populate('doctor', 'name email specialization')
        .sort({ appointmentDate: -1, appointmentTime: -1 })
    );
  } catch (e) {
    next(e);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    const [patients, doctors, appointments, pending, approved] = await Promise.all([
      User.countDocuments({ role: 'patient' }),
      User.countDocuments({ role: 'doctor' }),
      Appointment.countDocuments(),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'approved' }),
    ]);
    res.json({ patients, doctors, appointments, pending, approved });
  } catch (e) {
    next(e);
  }
};
