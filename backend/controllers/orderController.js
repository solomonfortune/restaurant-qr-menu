const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Table = require('../models/Table');

const createOrder = async (req, res) => {
  try {
    const { tableNumber, ownerId, items, customerNote } = req.body;

    if (!tableNumber || !ownerId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'tableNumber, ownerId, and at least one item are required' });
    }

    const table = await Table.findOne({ owner: ownerId, tableNumber, isActive: true });
    if (!table) {
      return res.status(404).json({ message: 'Table not found for this restaurant' });
    }

    const menuIds = items.map((item) => item.menuItem || item._id || item.id);
    const menuItems = await MenuItem.find({ _id: { $in: menuIds }, owner: ownerId, isAvailable: true });

    if (menuItems.length !== items.length) {
      return res.status(400).json({ message: 'One or more selected items are unavailable' });
    }

    const orderItems = items.map((item) => {
      const matchedItem = menuItems.find((menuItem) => String(menuItem._id) === String(item.menuItem || item._id || item.id));
      const quantity = Number(item.quantity) || 1;

      return {
        menuItem: matchedItem._id,
        name: matchedItem.name,
        price: matchedItem.price,
        quantity,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = await Order.create({
      tableNumber,
      tableId: table._id,
      items: orderItems,
      totalAmount,
      customerNote: customerNote || '',
      owner: ownerId,
    });

    return res.status(201).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ owner: req.user._id })
      .populate('tableId', 'tableNumber label')
      .populate('items.menuItem', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status supplied' });
    }

    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [todayOrders, totalMenuItems, pendingOrders, recentOrders] = await Promise.all([
      Order.find({ owner: req.user._id, createdAt: { $gte: startOfDay, $lte: endOfDay } }).sort({ createdAt: -1 }),
      MenuItem.countDocuments({ owner: req.user._id }),
      Order.countDocuments({ owner: req.user._id, status: 'pending' }),
      Order.find({ owner: req.user._id }).sort({ createdAt: -1 }).limit(5),
    ]);

    const totalRevenueToday = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    return res.status(200).json({
      totalOrdersToday: todayOrders.length,
      totalRevenueToday,
      totalMenuItems,
      pendingOrders,
      recentOrders,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch dashboard stats', error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  getDashboardStats,
};
