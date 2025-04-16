const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  preferences: Object,
  orderHistory: Array
});

module.exports = mongoose.model('User', userSchema);
