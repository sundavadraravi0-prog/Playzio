const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const MULTIPLIER = 92.74;

const moreToys = [
  // ACTION FIGURES
  { name: 'Ninja Stealth Warrior', description: 'Highly posable ninja figure with dual katanas and throwing stars. Includes smoke bomb accessories.', price: 15.99, comparePrice: 20.99, category: 'Action Figures', brand: 'ShadowOps', stock: 45, rating: 4.5, numReviews: 8 },
  { name: 'Galactic Space Ranger', description: 'Space ranger action figure with light-up jetpack and laser blaster sounds. Over 30 phrases!', price: 35.99, comparePrice: 45.99, category: 'Action Figures', brand: 'StarDefenders', stock: 30, rating: 4.8, numReviews: 24 },
  { name: 'Aquatic Monster Mutants', description: 'A glowing deep-sea mutant figure with crushing claw action. Perfect for underwater battles.', price: 18.99, comparePrice: 25.99, category: 'Action Figures', brand: 'MutantX', stock: 20, rating: 4.2, numReviews: 5 },
  { name: 'Fantasy Dragon Rider', description: 'Detailed dragon and rider figures. The dragon features flapping wings and realistic roaring sounds.', price: 45.99, comparePrice: 55.99, category: 'Action Figures', brand: 'MythicBeast', stock: 15, rating: 4.9, numReviews: 32 },

  // BUILDING BLOCKS
  { name: 'City Police Station', description: 'Build a bustling 3-level police station with jail cell, helipad, and 3 police vehicles.', price: 65.99, comparePrice: 85.99, category: 'Building Blocks', brand: 'BlockMaster', stock: 50, rating: 4.7, numReviews: 41 },
  { name: 'Medieval Castle Fortress', description: 'Defend the fortress! Includes drawbridge, catapults, knight figures, and royal horse.', price: 85.99, comparePrice: 105.99, category: 'Building Blocks', brand: 'HistoryBlocks', stock: 25, rating: 4.9, numReviews: 18 },
  { name: 'Space Shuttle Launch Pad', description: 'Detailed launch tower, rocket boosters, and ground crew vehicles. Over 800 pieces!', price: 95.99, comparePrice: 120.99, category: 'Building Blocks', brand: 'CosmicBuilds', stock: 10, rating: 4.8, numReviews: 27 },
  { name: 'Giant Bucket of Basics', description: 'Over 1000 classic colorful bricks to build absolutely anything your imagination desires.', price: 25.99, comparePrice: 35.99, category: 'Building Blocks', brand: 'BlockMaster', stock: 150, rating: 4.6, numReviews: 89 },

  // DOLLS
  { name: 'Mermaid Sparkle Float', description: 'A gorgeous mermaid doll with a color-changing tail in warm water. Comes with pet seahorse.', price: 21.99, comparePrice: 28.99, category: 'Dolls', brand: 'OceanDreams', stock: 65, rating: 4.5, numReviews: 14 },
  { name: 'Baby Doll Care Set', description: 'Soft-bodied baby doll with a diaper bag, milk bottle, pacifier, and a cute changing mat.', price: 30.99, comparePrice: 39.99, category: 'Dolls', brand: 'SweetBabies', stock: 40, rating: 4.8, numReviews: 61 },
  { name: 'Fashion Icon Stella', description: 'Stella comes with 3 interchangeable trendy outfits, boots, and a mini styling brush.', price: 25.99, comparePrice: 35.99, category: 'Dolls', brand: 'StyleIcons', stock: 80, rating: 4.6, numReviews: 33 },
  { name: 'Fairy Ballerina', description: 'Wind-up ballerina doll that pirouettes to a lovely melody. Features glittery wings and a tutu.', price: 18.99, comparePrice: 25.99, category: 'Dolls', brand: 'MagicDance', stock: 55, rating: 4.4, numReviews: 12 },

  // EDUCATIONAL
  { name: 'Solar System Planetarium', description: 'Paint and assemble your own moving solar system model. Learn about orbits and planets.', price: 16.99, comparePrice: 22.99, category: 'Educational', brand: 'ScienceKids', stock: 85, rating: 4.5, numReviews: 24 },
  { name: 'Math Bingo & Flashcards', description: 'A fun game to master addition and subtraction. Includes 6 bingo boards and 100 flashcards.', price: 14.99, comparePrice: 19.99, category: 'Educational', brand: 'LearnFast', stock: 120, rating: 4.7, numReviews: 45 },
  { name: 'Interactive World Globe', description: 'Touch different countries with the smart pen to hear fun facts, capitals, and populations.', price: 54.99, comparePrice: 79.99, category: 'Educational', brand: 'GlobeTrotter', stock: 22, rating: 4.9, numReviews: 76 },
  { name: 'Beginner Microscope Kit', description: '100x to 1200x magnification. Comes with slides, dyes, and a booklet of everyday things to look at.', price: 34.99, comparePrice: 45.99, category: 'Educational', brand: 'MicroExplore', stock: 48, rating: 4.6, numReviews: 31 },

  // BOARD GAMES
  { name: 'Mystery Detective Manor', description: 'Solve the case before time runs out! A thrilling cooperative deduction game for the whole family.', price: 29.99, comparePrice: 39.99, category: 'Board Games', brand: 'SleuthPress', stock: 60, rating: 4.8, numReviews: 55 },
  { name: 'Word Builder Safari', description: 'Race your animal tokens across the board by spelling words. Great for vocabulary building.', price: 19.99, comparePrice: 26.99, category: 'Board Games', brand: 'FunGames', stock: 90, rating: 4.3, numReviews: 17 },
  { name: 'Galactic Traders', description: 'A strategic resource management game. Trade goods between planets and build your space fleet.', price: 42.99, comparePrice: 55.99, category: 'Board Games', brand: 'CosmicPlay', stock: 30, rating: 4.9, numReviews: 42 },
  { name: 'Classic Family Monopoly', description: 'The timeless property trading game updated with dynamic new tokens and speed-dice rules.', price: 24.99, comparePrice: 32.99, category: 'Board Games', brand: 'ClassicPlay', stock: 150, rating: 4.7, numReviews: 200 },

  // ARTS & CRAFTS
  { name: 'Pottery Wheel Studio', description: 'Create your own vases and bowls! Includes real clay, a motorized wheel, and 6 paint colors.', price: 39.99, comparePrice: 49.99, category: 'Arts & Crafts', brand: 'ArtKids', stock: 25, rating: 4.5, numReviews: 36 },
  { name: 'Tie-Dye Party Kit', description: 'Everything needed for 10 shirts! 18 squeeze bottles of vibrant dyes and protective gloves.', price: 22.99, comparePrice: 29.99, category: 'Arts & Crafts', brand: 'ColorSplash', stock: 85, rating: 4.8, numReviews: 68 },
  { name: 'Bead Jewelry Maker', description: 'Thousands of colorful beads and premium elastic cord to create bracelets, necklaces, and more.', price: 15.99, comparePrice: 20.99, category: 'Arts & Crafts', brand: 'GemCreate', stock: 110, rating: 4.4, numReviews: 19 },
  { name: 'Magic Scratch Art Notebooks', description: 'Scratch away the black coating with the wooden stylus to reveal stunning rainbow colors beneath.', price: 12.99, comparePrice: 16.99, category: 'Arts & Crafts', brand: 'ScratchMagic', stock: 200, rating: 4.7, numReviews: 94 },

  // VEHICLES
  { name: 'Friction Powered Monster Truck', description: 'Push it forward and watch it climb obstacles! Features huge rubber tires and spring shocks.', price: 14.99, comparePrice: 19.99, category: 'Vehicles', brand: 'MudDiggers', stock: 80, rating: 4.6, numReviews: 22 },
  { name: 'Die-cast Sports Car Fleet', description: 'A collection of 10 shiny, metallic die-cast sports cars in 1:64 scale. Perfect for racing tracks.', price: 22.99, comparePrice: 30.99, category: 'Vehicles', brand: 'SpeedKing', stock: 95, rating: 4.8, numReviews: 47 },
  { name: 'City Garbage Truck', description: 'Realistic lights and sounds! Includes a motorized lifting mechanism and a recycle bin.', price: 34.99, comparePrice: 45.99, category: 'Vehicles', brand: 'CityWorks', stock: 40, rating: 4.5, numReviews: 31 },
  { name: 'Helicopter Rescue Patrol', description: 'Winch down the rescue basket! Press the button to spin the rotors and sound the siren.', price: 28.99, comparePrice: 36.99, category: 'Vehicles', brand: 'AeroRescue', stock: 50, rating: 4.7, numReviews: 28 },

  // PUZZLES
  { name: 'Enchanted Forest 500-Piece', description: 'A beautifully complex jigsaw puzzle featuring magical creatures hiding among ancient trees.', price: 16.99, comparePrice: 22.99, category: 'Puzzles', brand: 'PuzzleFun', stock: 65, rating: 4.6, numReviews: 21 },
  { name: 'Solar System Planet Peg Puzzle', description: 'Perfect for toddlers. Chunky wooden planets fit nicely into their respective orbits.', price: 12.99, comparePrice: 17.99, category: 'Puzzles', brand: 'WoodCrafts', stock: 120, rating: 4.9, numReviews: 87 },
  { name: 'Brain Teaser Metal Ring Set', description: '9 classic metal disentanglement puzzles. Tests patience and logical thinking.', price: 14.99, comparePrice: 19.99, category: 'Puzzles', brand: 'MindBenders', stock: 75, rating: 4.4, numReviews: 16 },
  { name: 'Glow in the Dark Ocean 1000-Piece', description: 'Watch the marine life come alive when the lights go out! High-quality thick pieces.', price: 24.99, comparePrice: 32.99, category: 'Puzzles', brand: 'PuzzleFun', stock: 35, rating: 4.8, numReviews: 44 },

  // OUTDOOR
  { name: 'Professional Kite with Tails', description: 'A large, durable nylon kite that catches wind easily. Includes 100m flying line on a spool.', price: 18.99, comparePrice: 25.99, category: 'Outdoor', brand: 'SkyRiders', stock: 85, rating: 4.7, numReviews: 52 },
  { name: 'Foam Pogo Jumper', description: 'Squeaks with every hop! Safe for indoor use but fantastic for getting energy out outdoors.', price: 21.99, comparePrice: 28.99, category: 'Outdoor', brand: 'ActiveKids', stock: 90, rating: 4.5, numReviews: 73 },
  { name: 'Hover Soccer Ball', description: 'Glides on a cushion of air! Surrounded by a soft foam bumper so it bounces safely off walls.', price: 19.99, comparePrice: 26.99, category: 'Outdoor', brand: 'AirStrike', stock: 60, rating: 4.6, numReviews: 39 },
  { name: 'Ring Toss Lawn Game', description: 'Classic backyard fun. Includes wooden target posts and heavy-duty rope rings.', price: 25.99, comparePrice: 34.99, category: 'Outdoor', brand: 'BackyardGames', stock: 45, rating: 4.4, numReviews: 18 },

  // STUFFED ANIMALS
  { name: 'Sloth Weighted Plush', description: 'A soft, weighted sloth designed to provide comforting pressure and sensory support.', price: 29.99, comparePrice: 39.99, category: 'Stuffed Animals', brand: 'CalmPets', stock: 40, rating: 4.9, numReviews: 112 },
  { name: 'Giant Stuffed Shark', description: 'Over 3 feet long! A surprisingly cuddly great white shark with extremely soft fabric.', price: 35.99, comparePrice: 48.99, category: 'Stuffed Animals', brand: 'SoftHugs', stock: 25, rating: 4.8, numReviews: 29 },
  { name: 'Fluffy Golden Retriever', description: 'Lifelike puppy plush with floppy ears and a realistic adorable face.', price: 24.99, comparePrice: 32.99, category: 'Stuffed Animals', brand: 'PuppyPals', stock: 70, rating: 4.7, numReviews: 41 },
  { name: 'Squishy Marshmallow Cat', description: 'Super-soft, squishy spandex fabric makes this round cat irresistible to hug.', price: 19.99, comparePrice: 26.99, category: 'Stuffed Animals', brand: 'SquishCloud', stock: 150, rating: 4.9, numReviews: 350 }
].map(p => ({
  ...p,
  price: Math.round((p.price * MULTIPLIER) * 100) / 100,
  comparePrice: p.comparePrice ? Math.round((p.comparePrice * MULTIPLIER) * 100) / 100 : undefined,
  images: p.images || ['https://via.placeholder.com/300x300?text=' + encodeURIComponent(p.name)]
}));

const insertNewToys = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.insertMany(moreToys);
    console.log(`Successfully added ${moreToys.length} new toys!`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

insertNewToys();
