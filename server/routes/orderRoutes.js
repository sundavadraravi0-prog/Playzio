const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createOrder, getMyOrders, getOrder } = require('../controllers/orderController');

router.post('/', protect, createOrder);
router.get('/', protect, getMyOrders);
router.get('/:id', protect, getOrder);

module.exports = router;
