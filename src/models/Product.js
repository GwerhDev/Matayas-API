const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: false },
  price: { type: Number, required: false },
  image: { type: String, required: true },
  description: { type: String, required: false },
  rate: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rate' }],
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  productGallery: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductGallery' }],
});

module.exports = mongoose.model('Product', productSchema);