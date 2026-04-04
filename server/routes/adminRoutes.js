const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {
  getStats, addProduct, updateProduct, deleteProduct,
  getAllOrders, updateOrderStatus, getAllReviews, deleteReview, getAllUsers
} = require('../controllers/adminController');

// All admin routes require auth + admin role
router.use(protect, adminAuth);

router.get('/stats', getStats);
router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/orders', getAllOrders);
router.put('/orders/:id', updateOrderStatus);
router.get('/reviews', getAllReviews);
router.delete('/reviews/:id', deleteReview);
router.get('/users', getAllUsers);

module.exports = router;
