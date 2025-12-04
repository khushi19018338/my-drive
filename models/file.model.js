const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    path: {
      type: String,
      required: true,   // Supabase full storage path
    },

    url: {
      type: String,
      required: true,   // Public or signed URL for download/view
    },

    size: {
      type: Number,
      default: 0,
    },

    mimetype: {
      type: String,
      default: 'application/octet-stream',
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,   // Only show files uploaded by this user
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', fileSchema);
