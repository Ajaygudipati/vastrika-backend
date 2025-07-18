const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const verifyToken = require('../middleware/verifyToken');

// Create Order
router.post('/', verifyToken, async (req, res) => {
  try {
    const { serviceType, description, measurements, address } = req.body;

    const newOrder = new Order({
      user: req.user.id,
      serviceType,
      description,
      measurements,
      address
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order', error });
  }
});

// Get All Orders of Logged-in User
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

module.exports = router;
