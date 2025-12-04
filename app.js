// Load environment variables
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

// Routers
const userRouter = require('./routes/user.routes');
const indexRouter = require('./routes/index.routes');
const fileRouter = require('./routes/file.routes');

const app = express();

// =========================
//  MONGODB CONNECTION
// =========================
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}
connectDB();

// =========================
//  MIDDLEWARE
// =========================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

// =========================
//  ROUTES
// =========================
app.use('/user', userRouter);
app.use('/', indexRouter);
app.use('/files', fileRouter); // <-- FIXED

// Default test route
app.get('/welcome', (req, res) => {
  res.send('Welcome to your Mini Google Drive!');
});

// =========================
//  START SERVER
// =========================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
