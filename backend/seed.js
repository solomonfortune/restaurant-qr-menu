require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    await User.deleteMany({});
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    await Table.deleteMany({});

    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      name: 'Test Restaurant',
      email: 'admin@digitaldiner.com',
      password: hashedPassword,
      restaurantName: 'The Digital Diner'
    });

    console.log('User created:', user.email);

    const categories = await Category.insertMany([
      { name: 'Starters', description: 'Begin your meal with our delicious appetizers', owner: user._id },
      { name: 'Main Course', description: 'Hearty entrees and main dishes', owner: user._id },
      { name: 'Desserts', description: 'Sweet treats to end your meal', owner: user._id },
      { name: 'Drinks', description: 'Refreshing beverages and cocktails', owner: user._id }
    ]);

    console.log('Categories created:', categories.length);

    const starters = categories.find(c => c.name === 'Starters');
    const mains = categories.find(c => c.name === 'Main Course');
    const desserts = categories.find(c => c.name === 'Desserts');
    const drinks = categories.find(c => c.name === 'Drinks');

    const menuItems = await MenuItem.insertMany([
      {
        name: 'Crispy Plantain Bites',
        description: 'Golden fried plantains served with spicy peanut sauce',
        price: 15000,
        category: starters._id,
        owner: user._id,
        isPopular: true,
        preparationTime: 10
      },
      {
        name: 'Grilled Goat Skewers',
        description: 'Tender goat meat marinated in indigenous spices',
        price: 25000,
        category: starters._id,
        owner: user._id,
        preparationTime: 15
      },
      {
        name: 'Bean Stew (Eboo)',
        description: 'Traditional slow-cooked bean stew with fresh herbs',
        price: 35000,
        category: mains._id,
        owner: user._id,
        isPopular: true,
        preparationTime: 20
      },
      {
        name: 'Matoke with Gnut Sauce',
        description: 'Steamed plantain and groundnut sauce, a local delicacy',
        price: 30000,
        category: mains._id,
        owner: user._id,
        preparationTime: 25
      },
      {
        name: 'Grilled Tilapia',
        description: 'Fresh river tilapia grilled to perfection with herbs',
        price: 45000,
        category: mains._id,
        owner: user._id,
        isPopular: true,
        preparationTime: 30
      },
      {
        name: 'Roasted Chicken',
        description: 'Free-range chicken roasted with African spices',
        price: 40000,
        category: mains._id,
        owner: user._id,
        preparationTime: 35
      },
      {
        name: 'Beef Luwombo',
        description: 'Beef stew steamed in banana leaves, a royal dish',
        price: 55000,
        category: mains._id,
        owner: user._id,
        preparationTime: 40
      },
      {
        name: 'Street-Style Chapati',
        description: 'Flattened bread with curry sauce',
        price: 12000,
        category: mains._id,
        owner: user._id,
        preparationTime: 15
      },
      {
        name: 'Mandazi & Tea',
        description: 'Fluffy fried dough with sweet Kenyan tea',
        price: 8000,
        category: desserts._id,
        owner: user._id,
        isPopular: true,
        preparationTime: 5
      },
      {
        name: 'Tropical Fruit Platter',
        description: 'Seasonal fresh fruits with honey drizzle',
        price: 15000,
        category: desserts._id,
        owner: user._id,
        preparationTime: 5
      },
      {
        name: 'Strained Curd (Amarula)',
        description: 'Traditional fermented milk dessert',
        price: 10000,
        category: desserts._id,
        owner: user._id,
        preparationTime: 5
      },
      {
        name: 'Fresh Sugarcane Juice',
        description: 'Freshly pressed sugarcane with lime',
        price: 5000,
        category: drinks._id,
        owner: user._id,
        isPopular: true,
        preparationTime: 3
      }
    ]);

    console.log('Menu items created:', menuItems.length);

    const tables = await Table.insertMany([
      { tableNumber: 1, label: 'Window Table', qrCodeUrl: `${process.env.FRONTEND_URL}/menu?table=1&owner=${user._id}`, owner: user._id },
      { tableNumber: 2, label: 'Corner Booth', qrCodeUrl: `${process.env.FRONTEND_URL}/menu?table=2&owner=${user._id}`, owner: user._id },
      { tableNumber: 3, label: 'Center Table', qrCodeUrl: `${process.env.FRONTEND_URL}/menu?table=3&owner=${user._id}`, owner: user._id },
      { tableNumber: 4, label: 'Patio Table', qrCodeUrl: `${process.env.FRONTEND_URL}/menu?table=4&owner=${user._id}`, owner: user._id },
      { tableNumber: 5, label: 'VIP Room', qrCodeUrl: `${process.env.FRONTEND_URL}/menu?table=5&owner=${user._id}`, owner: user._id }
    ]);

    console.log('Tables created:', tables.length);
    console.log('Seed complete');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedData();