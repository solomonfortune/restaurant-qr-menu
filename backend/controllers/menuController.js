const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');
const User = require('../models/User');
const { uploadToCloudinary } = require('../middleware/uploadMiddleware');

const parseBoolean = (value, fallback = false) => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return fallback;
};

const parseAllergens = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ owner: req.user._id, isActive: true }).sort({ name: 1 });
    return res.status(200).json(categories);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const category = await Category.create({
      name,
      description,
      image,
      owner: req.user._id,
    });

    return res.status(201).json(category);
  } catch (error) {
    const status = error.code === 11000 ? 400 : 500;
    return res.status(status).json({ message: 'Failed to create category', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const itemCount = await MenuItem.countDocuments({ category: req.params.id, owner: req.user._id });
    if (itemCount > 0) {
      return res.status(400).json({ message: 'Delete menu items in this category first' });
    }

    const category = await Category.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};

const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find({ owner: req.user._id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch menu items', error: error.message });
  }
};

const getPublicMenu = async (req, res) => {
  try {
    const { ownerId } = req.query;

    if (!ownerId) {
      return res.status(400).json({ message: 'ownerId query parameter is required' });
    }

    const owner = await User.findById(ownerId).select('restaurantName');
    if (!owner) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const categories = await Category.find({ owner: ownerId, isActive: true }).sort({ name: 1 });
    const items = await MenuItem.find({ owner: ownerId, isAvailable: true })
      .populate('category', 'name')
      .sort({ isPopular: -1, createdAt: -1 });

    const groupedMenu = categories.map((category) => ({
      _id: category._id,
      name: category.name,
      description: category.description,
      image: category.image,
      items: items.filter((item) => String(item.category?._id) === String(category._id)),
    })).filter((category) => category.items.length > 0);

    return res.status(200).json({
      restaurantName: owner.restaurantName,
      categories: groupedMenu,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch public menu', error: error.message });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, preparationTime, allergens, isPopular, isAvailable } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Name, description, price, and category are required' });
    }

    const existingCategory = await Category.findOne({ _id: category, owner: req.user._id });
    if (!existingCategory) {
      return res.status(400).json({ message: 'Selected category is invalid' });
    }

    const imageUrl = req.file ? await uploadToCloudinary(req.file.buffer) : '';

    const item = await MenuItem.create({
      name,
      description,
      price: Number(price),
      category,
      owner: req.user._id,
      image: imageUrl,
      preparationTime: Number(preparationTime) || 15,
      allergens: parseAllergens(allergens),
      isPopular: parseBoolean(isPopular),
      isAvailable: typeof isAvailable === 'undefined' ? true : parseBoolean(isAvailable, true),
    });

    const populatedItem = await MenuItem.findById(item._id).populate('category', 'name');
    return res.status(201).json(populatedItem);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create menu item', error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.category) {
      const existingCategory = await Category.findOne({ _id: updateData.category, owner: req.user._id });
      if (!existingCategory) {
        return res.status(400).json({ message: 'Selected category is invalid' });
      }
    }

    if (req.file) {
      updateData.image = await uploadToCloudinary(req.file.buffer);
    }

    if (typeof updateData.price !== 'undefined') updateData.price = Number(updateData.price);
    if (typeof updateData.preparationTime !== 'undefined') updateData.preparationTime = Number(updateData.preparationTime);
    if (typeof updateData.isPopular !== 'undefined') updateData.isPopular = parseBoolean(updateData.isPopular);
    if (typeof updateData.isAvailable !== 'undefined') updateData.isAvailable = parseBoolean(updateData.isAvailable, true);
    if (typeof updateData.allergens !== 'undefined') updateData.allergens = parseAllergens(updateData.allergens);

    const item = await MenuItem.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('category', 'name');

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update menu item', error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    return res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete menu item', error: error.message });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const item = await MenuItem.findOne({ _id: req.params.id, owner: req.user._id });
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    const populatedItem = await MenuItem.findById(item._id).populate('category', 'name');
    return res.status(200).json(populatedItem);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to toggle availability', error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getMenuItems,
  getPublicMenu,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability,
};
