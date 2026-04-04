const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user's cart
// @route   GET /api/cart
const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price images stock');

    if (!cart) {
      return res.json({ items: [] });
    }

    // Build response with product details and filter out any deleted products
    const items = cart.items
      .filter(item => item.product) // filter out items whose product was deleted
      .map(item => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images?.[0] || '',
        stock: item.product.stock,
        quantity: item.quantity
      }));

    res.json({ items });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart (or increase quantity if already exists)
// @route   POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      res.status(400);
      throw new Error('Product ID is required');
    }

    // Validate product exists and has stock
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart for user
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }]
      });
    } else {
      // Check if product already in cart
      const existingItem = cart.items.find(
        item => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      // Validate stock for the updated quantity
      const itemInCart = cart.items.find(
        item => item.product.toString() === productId
      );
      if (itemInCart.quantity > product.stock) {
        res.status(400);
        throw new Error(`Only ${product.stock} items available in stock`);
      }

      await cart.save();
    }

    // Populate and return updated cart
    await cart.populate('items.product', 'name price images stock');

    const items = cart.items
      .filter(item => item.product)
      .map(item => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images?.[0] || '',
        stock: item.product.stock,
        quantity: item.quantity
      }));

    res.json({ items });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/cart/:productId
const updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      res.status(400);
      throw new Error('Quantity must be at least 1');
    }

    // Validate stock
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (quantity > product.stock) {
      res.status(400);
      throw new Error(`Only ${product.stock} items available in stock`);
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    const item = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!item) {
      res.status(404);
      throw new Error('Item not in cart');
    }

    item.quantity = quantity;
    await cart.save();

    // Populate and return
    await cart.populate('items.product', 'name price images stock');

    const items = cart.items
      .filter(item => item.product)
      .map(item => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images?.[0] || '',
        stock: item.product.stock,
        quantity: item.quantity
      }));

    res.json({ items });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    // Populate and return
    await cart.populate('items.product', 'name price images stock');

    const items = cart.items
      .filter(item => item.product)
      .map(item => ({
        _id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        image: item.product.images?.[0] || '',
        stock: item.product.stock,
        quantity: item.quantity
      }));

    res.json({ items });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    await Cart.deleteOne({ user: req.user._id });
    res.json({ items: [] });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
