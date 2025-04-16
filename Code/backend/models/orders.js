const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  items: Array,
  totalAmount: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
