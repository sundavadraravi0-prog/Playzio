const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  customerDetails: {
    name: String,
    email: String,
    phone: String
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  billingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true }
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded', 'cancelled'],
    default: 'paid' // Defaulting to paid since orders are typically paid at creation in this flow
  },
  paymentMethod: {
    type: String,
    default: 'Credit Card'
  },
  paidAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bill', billSchema);
