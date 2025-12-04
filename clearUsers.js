const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user.model');

dotenv.config();

async function clearUsers() {
  try {
    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Delete all users
    const result = await User.deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} users`);

    // Close connection
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
    
  } catch (error) {
    console.error("❌ Error while clearing users:", error.message);
  }
}

clearUsers();
