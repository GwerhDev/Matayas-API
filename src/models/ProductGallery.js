const mongoose = require("mongoose");

const productGallerySchema = new mongoose.Schema({
  file: { type: String, required: true },
});

module.exports = mongoose.model('ProductGallery', productGallerySchema);
