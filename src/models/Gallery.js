const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  file: { type: String, required: true },
  name: { type: String, required: false },
  description: { type: String, required: false },
});

module.exports = mongoose.model('Gallery', gallerySchema);
