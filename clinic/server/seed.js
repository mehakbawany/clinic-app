// Creates the first admin account. Run once: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = (process.env.ADMIN_EMAIL || 'admin@clinic.com').toLowerCase();
    if (await User.findOne({ email })) {
      console.log('Admin already exists:', email);
    } else {
      await User.create({
        name: process.env.ADMIN_NAME || 'Clinic Admin',
        email,
        password: process.env.ADMIN_PASSWORD || 'Admin@12345',
        role: 'admin',
      });
      console.log('Admin created:', email);
    }
  } catch (e) {
    console.error(e.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
