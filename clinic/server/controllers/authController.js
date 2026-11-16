const jwt = require('jsonwebtoken');
const User = require('../models/User');

const sign = (user) => jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const emailRe = /^\S+@\S+\.\S+$/;

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !name.trim() || !emailRe.test(email || '') || !password || password.length < 6) {
      return res.status(400).json({ message: 'Name, a valid email and a password of at least 6 characters are required' });
    }
    if (await User.findOne({ email: email.toLowerCase() })) {
      return res.status(409).json({ message: 'Email is already registered' });
    }
    // Public registration always creates a patient.
    const user = await User.create({ name: name.trim(), email, password, role: 'patient' });
    res.status(201).json({ token: sign(user), user });
  } catch (e) {
    next(e);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Your account has been deactivated. Contact the clinic admin.' });
    res.json({ token: sign(user), user });
  } catch (e) {
    next(e);
  }
};
