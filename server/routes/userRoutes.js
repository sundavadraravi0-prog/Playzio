const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getProfile, updateProfile, changePassword, toggleWishlist, getWishlist } = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/wishlist/:productId', protect, toggleWishlist);
router.get('/wishlist', protect, getWishlist);

module.exports = router;
