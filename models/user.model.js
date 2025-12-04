const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: [5, 'Email must be at least 5 characters long'],
      lowercase: true,
      match: [/.+\@.+\..+/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, 'Password must be at least 5 characters long'],
    },
  },
  { timestamps: true }
);

// Hash password before saving (only if modified)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
