// routes/file.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../config/supabase');
const File = require('../models/file.model');
const auth = require('../middleware/auth');

// Multer memory storage (no local saving)
const upload = multer({ storage: multer.memoryStorage() });

// -------------------------------------------------
// UPLOAD FILE
// -------------------------------------------------
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) return res.status(400).send("No file selected");

    const storagePath = `${req.user.userId}/${Date.now()}-${file.originalname}`;

    // Upload to Supabase
    const { error } = await supabase.storage
      .from('drive')
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from('drive')
      .getPublicUrl(storagePath);

    // Save file record in MongoDB
    await File.create({
      name: file.originalname,
      path: storagePath,
      url: urlData.publicUrl,
      size: file.size,
      mimetype: file.mimetype,
      userId: req.user.userId
    });

    res.redirect('/home');

  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).send("File upload failed");
  }
});

// -------------------------------------------------
// DELETE FILE
// -------------------------------------------------
router.get('/delete/:id', auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file) return res.redirect('/home');

    // Remove from Supabase storage
    await supabase.storage.from('drive').remove([file.path]);

    // Remove from MongoDB
    await File.findByIdAndDelete(req.params.id);

    res.redirect('/home');

  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).send("Delete failed");
  }
});

module.exports = router;
