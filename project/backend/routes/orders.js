const express = require('express');
const Order = require('D:\\7 sem\\7 sem\\FSD\\project\\backend\\models\\orders.js');
const router = express.Router();

router.post('/place-order', async (req, res) => {
  const { userId, items, totalAmount } = req.body;
  try {
    const newOrder = await Order.create({ userId, items, totalAmount });
    res.status(201).json({ message: 'Order placed', order: newOrder });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:userId', async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  res.json(orders);
});

module.exports = router;
