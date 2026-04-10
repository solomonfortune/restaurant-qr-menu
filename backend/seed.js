const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');
const Table = require('./models/Table');
const Order = require('./models/Order');

const DEMO_EMAIL = 'admin@digitaldiner.com';

const seedData = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();

    const existingDemoUser = await User.findOne({ email: DEMO_EMAIL });

    if (existingDemoUser) {
      await Promise.all([
        Category.deleteMany({ owner: existingDemoUser._id }),
        MenuItem.deleteMany({ owner: existingDemoUser._id }),
        Table.deleteMany({ owner: existingDemoUser._id }),
        Order.deleteMany({ owner: existingDemoUser._id }),
      ]);

      await User.deleteOne({ _id: existingDemoUser._id });
    }

    const user = await User.create({
      name: 'Test Restaurant',
      restaurantName: 'The Digital Diner',
      email: DEMO_EMAIL,
      password: 'password123',
    });

    const categoryDocs = await Category.insertMany([
      { name: 'Starters', description: 'Light bites to open the meal.', owner: user._id },
      { name: 'Main Course', description: 'Hearty signature dishes.', owner: user._id },
      { name: 'Desserts', description: 'Sweet treats worth saving room for.', owner: user._id },
      { name: 'Drinks', description: 'Fresh juices, sodas, and specialty sips.', owner: user._id },
    ]);

    const categoryMap = Object.fromEntries(categoryDocs.map((category) => [category.name, category._id]));

    await MenuItem.insertMany([
      { name: 'Rolex Bites', description: 'Mini chapati rolls stuffed with eggs, tomato, and onion.', price: 9000, category: categoryMap.Starters, owner: user._id, isAvailable: true, isPopular: true, preparationTime: 10, allergens: ['Eggs', 'Gluten'] },
      { name: 'Cassava Crisps', description: 'Crispy cassava wedges with smoked paprika mayo.', price: 12000, category: categoryMap.Starters, owner: user._id, isAvailable: true, preparationTime: 12, allergens: ['Eggs'] },
      { name: 'Spiced Goat Skewers', description: 'Chargrilled goat skewers with kachumbari and lime.', price: 28000, category: categoryMap['Main Course'], owner: user._id, isAvailable: true, isPopular: true, preparationTime: 25, allergens: [] },
      { name: 'Tilapia Platter', description: 'Whole grilled tilapia with plantain mash and greens.', price: 36000, category: categoryMap['Main Course'], owner: user._id, isAvailable: true, preparationTime: 30, allergens: ['Fish'] },
      { name: 'Matoke Bowl', description: 'Stewed matoke with peanut sauce and market vegetables.', price: 22000, category: categoryMap['Main Course'], owner: user._id, isAvailable: true, preparationTime: 20, allergens: ['Peanuts'] },
      { name: 'Chicken Pilau', description: 'Fragrant pilau rice topped with tender roast chicken.', price: 26000, category: categoryMap['Main Course'], owner: user._id, isAvailable: true, preparationTime: 22, allergens: [] },
      { name: 'Passion Cheesecake', description: 'Creamy passionfruit cheesecake with biscuit crust.', price: 14000, category: categoryMap.Desserts, owner: user._id, isAvailable: true, preparationTime: 8, allergens: ['Dairy', 'Gluten'] },
      { name: 'Mandazi Sundae', description: 'Warm mandazi pieces with vanilla ice cream and caramel.', price: 13000, category: categoryMap.Desserts, owner: user._id, isAvailable: true, preparationTime: 7, allergens: ['Dairy', 'Gluten'] },
      { name: 'Chocolate Lava Pot', description: 'Rich chocolate pudding with a gooey molten center.', price: 15000, category: categoryMap.Desserts, owner: user._id, isAvailable: true, preparationTime: 12, allergens: ['Dairy', 'Eggs', 'Gluten'] },
      { name: 'Tropical Sunrise', description: 'Fresh mango, pineapple, and orange juice blend.', price: 8000, category: categoryMap.Drinks, owner: user._id, isAvailable: true, preparationTime: 5, allergens: [] },
      { name: 'Iced Hibiscus Tea', description: 'Floral hibiscus tea served chilled with mint.', price: 7000, category: categoryMap.Drinks, owner: user._id, isAvailable: true, preparationTime: 4, allergens: [] },
      { name: 'House Coffee', description: 'Bold Ugandan coffee served black or with milk.', price: 6000, category: categoryMap.Drinks, owner: user._id, isAvailable: true, preparationTime: 6, allergens: ['Dairy'] },
    ]);

    await Table.insertMany(
      [1, 2, 3, 4, 5].map((tableNumber) => ({
        tableNumber,
        label: `Table ${tableNumber}`,
        owner: user._id,
        qrCodeUrl: `${process.env.FRONTEND_URL}/menu?table=${tableNumber}&owner=${user._id}`,
      }))
    );

    console.log('Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seedData();
