const express = require('express');
const router = express.Router();
const { getProducts, getFeaturedProducts, getCategories, getProduct } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);

module.exports = router;
