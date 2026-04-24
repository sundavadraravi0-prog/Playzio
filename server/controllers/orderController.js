const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Bill = require('../models/Bill');

const generateInvoiceNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}-${random}`;
};

// @desc    Create order
// @route   POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = 'Credit Card' } = req.body;

    if (!items || items.length === 0) {
      res.status(400);
      throw new Error('No order items');
    }

    // Calculate total and validate stock
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        res.status(404);
        throw new Error(`Product not found: ${item.product}`);
      }
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      subtotal += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.images[0] || ''
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    const shippingPrice = subtotal >= 4000 ? 0 : 499;
    const taxPrice = Math.round(subtotal * 0.18); // 18% GST/Tax
    const totalAmount = subtotal + shippingPrice;
    const invoiceNumber = generateInvoiceNumber();

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal,
      shippingPrice,
      taxPrice,
      totalAmount,
      invoiceNumber,
      paidAt: paymentMethod === 'Cash on Delivery' ? null : new Date()
    });

    // Create a corresponding Bill
    const bill = await Bill.create({
      order: order._id,
      user: req.user._id,
      billNumber: invoiceNumber, // Reusing invoiceNumber as billNumber
      customerDetails: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone
      },
      items: orderItems,
      billingAddress: shippingAddress, // Defaulting to shipping address
      subtotal,
      shippingPrice,
      taxPrice,
      totalAmount,
      status: paymentMethod === 'Cash on Delivery' ? 'unpaid' : 'paid',
      paymentMethod
    });

    // Link the bill back to the order
    order.bill = bill._id;
    await order.save();

    // Clear the user's cart after successful order
    await Cart.deleteOne({ user: req.user._id });

    res.status(201).json({ order, bill });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('bill').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('bill');
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Ensure user can only see their own orders (unless admin)
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, getMyOrders, getOrder };
