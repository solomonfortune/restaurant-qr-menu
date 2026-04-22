const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ owner: req.user.id, isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide a category name' });
    }

    const category = await Category.create({
      name,
      description,
      image,
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image, isActive } = req.body;

    let category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this category' });
    }

    category = await Category.findByIdAndUpdate(id, { name, description, image, isActive }, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (category.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this category' });
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Category deleted'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ owner: req.user.id })
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      menuItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getPublicMenu = async (req, res) => {
  try {
    const { ownerId } = req.query;

    if (!ownerId) {
      return res.status(400).json({ message: 'Please provide owner ID' });
    }

    const categories = await Category.find({ owner: ownerId, isActive: true }).sort({ name: 1 });
    const menuItems = await MenuItem.find({ owner: ownerId, isAvailable: true })
      .populate('category', 'name')
      .sort({ name: 1 });

    const groupedMenu = categories.map(category => ({
      category: category.name,
      description: category.description,
      items: menuItems.filter(item => item.category._id.toString() === category._id.toString())
    }));

    res.status(200).json({
      success: true,
      menu: groupedMenu.filter(group => group.items.length > 0)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, isPopular, preparationTime, allergens } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      price,
      category,
      image,
      owner: req.user.id,
      isPopular,
      preparationTime,
      allergens
    });

    await menuItem.populate('category', 'name');

    res.status(201).json({
      success: true,
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image, isAvailable, isPopular, preparationTime, allergens } = req.body;

    let menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this menu item' });
    }

    menuItem = await MenuItem.findByIdAndUpdate(id, {
      name,
      description,
      price,
      category,
      image,
      isAvailable,
      isPopular,
      preparationTime,
      allergens
    }, { new: true, runValidators: true }).populate('category', 'name');

    res.status(200).json({
      success: true,
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this menu item' });
    }

    await MenuItem.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Menu item deleted'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    if (menuItem.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    menuItem.isAvailable = !menuItem.isAvailable;
    await menuItem.save();

    res.status(200).json({
      success: true,
      menuItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
  toggleAvailability
};