const mongoose = require('mongoose');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const populate = [
  { path: 'patient', select: 'name email' },
  { path: 'doctor', select: 'name email specialization experience' },
];

exports.createAppointment = async (req, res, next) => {
  try {
    const { doctor, appointmentDate, appointmentTime, reason } = req.body;
    if (!mongoose.isValidObjectId(doctor)) return res.status(400).json({ message: 'Please select a doctor' });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate || '') || isNaN(new Date(appointmentDate))) {
      return res.status(400).json({ message: 'A valid date (YYYY-MM-DD) is required' });
    }
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(appointmentTime || '')) {
      return res.status(400).json({ message: 'A valid time (HH:MM) is required' });
    }
    if (!reason || !reason.trim()) return res.status(400).json({ message: 'Reason for visit is required' });
    if (appointmentDate < new Date().toISOString().slice(0, 10)) {
      return res.status(400).json({ message: 'You cannot book an appointment in the past' });
    }

    const doc = await User.findOne({ _id: doctor, role: 'doctor', isActive: true });
    if (!doc) return res.status(404).json({ message: 'Doctor not found or unavailable' });

    const date = new Date(`${appointmentDate}T00:00:00.000Z`);
    // Blocks duplicates: any pending/approved booking for this doctor at this date+time.
    const clash = await Appointment.findOne({
      doctor: doc._id,
      appointmentDate: date,
      appointmentTime,
      status: { $in: ['pending', 'approved'] },
    });
    if (clash) return res.status(409).json({ message: 'This doctor already has an appointment at that date and time. Please choose another slot.' });

    const appt = await Appointment.create({
      patient: req.user._id,
      doctor: doc._id,
      appointmentDate: date,
      appointmentTime,
      reason: reason.trim(),
    });
    res.status(201).json(await appt.populate(populate));
  } catch (e) {
    next(e);
  }
};

exports.myAppointments = async (req, res, next) => {
  try {
    res.json(await Appointment.find({ patient: req.user._id }).populate(populate).sort({ appointmentDate: -1, appointmentTime: -1 }));
  } catch (e) {
    next(e);
  }
};

exports.doctorAppointments = async (req, res, next) => {
  try {
    res.json(await Appointment.find({ doctor: req.user._id }).populate(populate).sort({ appointmentDate: 1, appointmentTime: 1 }));
  } catch (e) {
    next(e);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ message: 'Status must be approved or rejected' });
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid appointment id' });
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (String(appt.doctor) !== String(req.user._id)) return res.status(403).json({ message: 'This appointment is not assigned to you' });
    if (appt.status !== 'pending') return res.status(400).json({ message: `Appointment is already ${appt.status}` });
    appt.status = status;
    await appt.save();
    res.json(await appt.populate(populate));
  } catch (e) {
    next(e);
  }
};

exports.cancelAppointment = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid appointment id' });
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: 'Appointment not found' });
    if (String(appt.patient) !== String(req.user._id)) return res.status(403).json({ message: 'This is not your appointment' });
    if (appt.status !== 'pending') return res.status(400).json({ message: 'Only pending appointments can be cancelled' });
    appt.status = 'cancelled';
    await appt.save();
    res.json(await appt.populate(populate));
  } catch (e) {
    next(e);
  }
};
