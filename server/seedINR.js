const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: 'Super Robot Transformer',
    description: 'An amazing transforming robot action figure that converts from a car to a powerful robot warrior. Features LED lights and sound effects for an immersive play experience.',
    price: 29.99,
    comparePrice: 39.99,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400'],
    category: 'Action Figures',
    ageRange: { min: 5, max: 12 },
    brand: 'RoboToys',
    stock: 50,
    rating: 4.5,
    numReviews: 12,
    featured: true
  },
  {
    name: 'Magic Building Blocks Set',
    description: 'A colorful set of 500 interlocking building blocks. Encourages creativity and spatial thinking. Compatible with all major building block brands.',
    price: 34.99,
    comparePrice: 44.99,
    images: ['https://images.unsplash.com/photo-1587654780291-39c9404d7dd0?w=400'],
    category: 'Building Blocks',
    ageRange: { min: 3, max: 10 },
    brand: 'BlockMaster',
    stock: 100,
    rating: 4.8,
    numReviews: 25,
    featured: true
  },
  {
    name: 'Princess Dream Castle',
    description: 'A beautiful pink castle playset with princess dolls, furniture, and accessories. Features opening doors, a working elevator, and light-up chandelier.',
    price: 49.99,
    comparePrice: 69.99,
    images: ['https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400'],
    category: 'Dolls',
    ageRange: { min: 3, max: 8 },
    brand: 'DreamPlay',
    stock: 30,
    rating: 4.6,
    numReviews: 18,
    featured: true
  },
  {
    name: 'STEM Science Lab Kit',
    description: 'An exciting science experiment kit with 50+ experiments. Includes test tubes, microscope, chemical compounds (safe), and a detailed instruction book.',
    price: 39.99,
    comparePrice: 54.99,
    images: ['https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400'],
    category: 'Educational',
    ageRange: { min: 6, max: 12 },
    brand: 'ScienceKids',
    stock: 40,
    rating: 4.7,
    numReviews: 22,
    featured: true
  },
  {
    name: 'Adventure Board Game',
    description: 'An exciting family board game where players explore mysterious islands, solve puzzles, and race to find hidden treasure. Great for game nights!',
    price: 24.99,
    comparePrice: 34.99,
    images: ['https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=400'],
    category: 'Board Games',
    ageRange: { min: 6, max: 12 },
    brand: 'FunGames',
    stock: 60,
    rating: 4.4,
    numReviews: 15,
    featured: true
  },
  {
    name: 'Rainbow Art Supplies Set',
    description: 'Complete art supplies kit with 120 colored pencils, watercolors, markers, crayons, drawing paper, and a carrying case. Perfect for young artists!',
    price: 27.99,
    comparePrice: 35.99,
    images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400'],
    category: 'Arts & Crafts',
    ageRange: { min: 4, max: 12 },
    brand: 'ArtKids',
    stock: 75,
    rating: 4.6,
    numReviews: 20,
    featured: true
  },
  {
    name: 'Remote Control Racing Car',
    description: 'High-speed RC car with proportional steering and throttle. Reaches speeds up to 20mph. Includes rechargeable battery and USB charger.',
    price: 44.99,
    comparePrice: 59.99,
    images: ['https://images.unsplash.com/photo-1581235707960-23b7e8f7e172?w=400'],
    category: 'Vehicles',
    ageRange: { min: 6, max: 12 },
    brand: 'SpeedKing',
    stock: 35,
    rating: 4.3,
    numReviews: 10,
    featured: true
  },
  {
    name: 'Giant Floor Puzzle - World Map',
    description: 'A beautiful 100-piece giant floor puzzle featuring a colorful world map. Finished size is 3ft x 2ft. Teaches geography while being fun!',
    price: 19.99,
    comparePrice: 24.99,
    images: ['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400'],
    category: 'Puzzles',
    ageRange: { min: 4, max: 8 },
    brand: 'PuzzleFun',
    stock: 80,
    rating: 4.5,
    numReviews: 14,
    featured: true
  },
  {
    name: 'Outdoor Explorer Kit',
    description: 'Everything a young explorer needs! Includes binoculars, compass, magnifying glass, flashlight, bug catcher, and a backpack to carry it all.',
    price: 32.99,
    comparePrice: 42.99,
    images: ['https://images.unsplash.com/photo-1472162072942-cd5147eb3902?w=400'],
    category: 'Outdoor',
    ageRange: { min: 5, max: 12 },
    brand: 'NatureKids',
    stock: 45,
    rating: 4.7,
    numReviews: 19,
    featured: false
  },
  {
    name: 'Cuddly Teddy Bear',
    description: 'An ultra-soft, huggable teddy bear made from premium plush fabric. 18 inches tall with a cute bow tie. Machine washable.',
    price: 22.99,
    comparePrice: 29.99,
    images: ['https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=400'],
    category: 'Stuffed Animals',
    ageRange: { min: 0, max: 8 },
    brand: 'SoftHugs',
    stock: 90,
    rating: 4.9,
    numReviews: 30,
    featured: false
  },
  {
    name: 'Dinosaur Play Set',
    description: 'A set of 12 realistic dinosaur figures with a play mat featuring a prehistoric landscape. Includes T-Rex, Triceratops, and more!',
    price: 26.99,
    comparePrice: 34.99,
    images: ['https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=400'],
    category: 'Action Figures',
    ageRange: { min: 3, max: 10 },
    brand: 'DinoWorld',
    stock: 55,
    rating: 4.4,
    numReviews: 16,
    featured: false
  },
  {
    name: 'Musical Keyboard Piano',
    description: 'A 49-key electronic keyboard with 100 tones, 50 rhythms, and recording function. Perfect for learning music. Includes music book.',
    price: 54.99,
    comparePrice: 74.99,
    images: ['https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400'],
    category: 'Educational',
    ageRange: { min: 4, max: 12 },
    brand: 'MusicKids',
    stock: 25,
    rating: 4.5,
    numReviews: 11,
    featured: false
  },
  {
    name: 'Space Rocket Building Kit',
    description: 'Build your own space rocket with this 350-piece construction kit. Features astronaut figures, launch pad, and mission control center.',
    price: 42.99,
    comparePrice: 56.99,
    images: ['https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400'],
    category: 'Building Blocks',
    ageRange: { min: 6, max: 12 },
    brand: 'BlockMaster',
    stock: 40,
    rating: 4.8,
    numReviews: 21,
    featured: false
  },
  {
    name: 'Fairy Garden Craft Kit',
    description: 'Create your own magical fairy garden! Includes miniature fairy house, tiny furniture, fairy figures, moss, pebbles, and a planting tray.',
    price: 24.99,
    comparePrice: 32.99,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400'],
    category: 'Arts & Crafts',
    ageRange: { min: 5, max: 10 },
    brand: 'CraftMagic',
    stock: 35,
    rating: 4.3,
    numReviews: 9,
    featured: false
  },
  {
    name: 'Strategy Chess Set for Kids',
    description: 'A beginner-friendly chess set with larger pieces and a color-coded board. Includes an illustrated instruction booklet teaching basic moves and strategies.',
    price: 18.99,
    comparePrice: 24.99,
    images: ['https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400'],
    category: 'Board Games',
    ageRange: { min: 5, max: 12 },
    brand: 'FunGames',
    stock: 70,
    rating: 4.6,
    numReviews: 17,
    featured: false
  },
  {
    name: 'Water Blaster Super Soaker',
    description: 'The ultimate water blaster for summer fun! Holds 1 liter of water and shoots up to 30 feet. Easy pump action for kids of all ages.',
    price: 16.99,
    comparePrice: 22.99,
    images: ['https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400'],
    category: 'Outdoor',
    ageRange: { min: 4, max: 12 },
    brand: 'SplashFun',
    stock: 100,
    rating: 4.2,
    numReviews: 13,
    featured: false
  },
  {
    name: 'Coding Robot for Kids',
    description: 'An interactive robot that teaches programming concepts through play. Control it with a tablet app or physical coding cards. 30+ activities included.',
    price: 59.99,
    comparePrice: 79.99,
    images: ['https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=400'],
    category: 'Educational',
    ageRange: { min: 5, max: 12 },
    brand: 'CodeBot',
    stock: 20,
    rating: 4.9,
    numReviews: 28,
    featured: false
  },
  {
    name: 'Construction Truck Set',
    description: 'A set of 6 die-cast construction vehicles: excavator, bulldozer, dump truck, crane, mixer, and forklift. Durable metal with movable parts.',
    price: 31.99,
    comparePrice: 39.99,
    images: ['https://images.unsplash.com/photo-1581235707960-23b7e8f7e172?w=400'],
    category: 'Vehicles',
    ageRange: { min: 3, max: 8 },
    brand: 'TruckZone',
    stock: 65,
    rating: 4.5,
    numReviews: 22,
    featured: false
  },
  {
    name: '3D Crystal Puzzle Lion',
    description: 'A stunning 3D crystal puzzle that builds into a majestic lion. 97 transparent interlocking pieces. Great for display after completion!',
    price: 14.99,
    comparePrice: 19.99,
    images: ['https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400'],
    category: 'Puzzles',
    ageRange: { min: 8, max: 12 },
    brand: 'PuzzleFun',
    stock: 50,
    rating: 4.4,
    numReviews: 8,
    featured: false
  },
  {
    name: 'Unicorn Plush Collection',
    description: 'A set of 3 sparkly unicorn plush toys in pink, purple, and rainbow. Each is 12 inches tall with soft, glittery fur and embroidered eyes.',
    price: 28.99,
    comparePrice: 36.99,
    images: ['https://images.unsplash.com/photo-1559715541-5daf8a0296d0?w=400'],
    category: 'Stuffed Animals',
    ageRange: { min: 2, max: 8 },
    brand: 'SoftHugs',
    stock: 55,
    rating: 4.7,
    numReviews: 24,
    featured: false
  }
];

const MULTIPLIER = 92.74;

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Multiply prices
    const adjustedProducts = products.map(p => ({
      ...p,
      price: Math.round((p.price * MULTIPLIER) * 100) / 100,
      comparePrice: p.comparePrice ? Math.round((p.comparePrice * MULTIPLIER) * 100) / 100 : undefined
    }));

    // Insert products
    await Product.insertMany(adjustedProducts);
    console.log(`Inserted ${adjustedProducts.length} products with a multiplier of ${MULTIPLIER}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();
