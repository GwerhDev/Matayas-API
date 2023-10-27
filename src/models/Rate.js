const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema({
  name: { type: String, required: false },
});

module.exports = mongoose.model('Rate', rateSchema);
