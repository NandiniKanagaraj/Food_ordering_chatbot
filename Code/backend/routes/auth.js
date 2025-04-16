const express = require('express');
const User = require('D:\\7 sem\\7 sem\\FSD\\project\\backend\\models\\users.js');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const newUser = await User.create({ username, email, password });
    res.status(201).json({ message: 'User registered', userId: newUser._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) res.json({ message: 'Login successful', user });
  else res.status(400).json({ error: 'Invalid credentials' });
});

module.exports = router;
