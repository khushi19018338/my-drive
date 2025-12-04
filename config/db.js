const mongoose = require('mongoose');

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1); // Stop server if DB not connected
  }
}

module.exports = connectToDB;
