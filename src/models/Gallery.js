const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  name: { type: String, required: false },
});

module.exports = mongoose.model('Gallery', gallerySchema);
