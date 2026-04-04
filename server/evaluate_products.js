const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
dotenv.config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const products = await Product.find({}).limit(1);
  console.log('Sample Price:', products[0].price);
  process.exit(0);
});
