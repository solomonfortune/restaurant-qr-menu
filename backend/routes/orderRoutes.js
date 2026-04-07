const express = require('express');
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  getDashboardStats,
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', createOrder);
router.get('/', protect, getOrders);
router.get('/stats', protect, getDashboardStats);
router.patch('/:id/status', protect, updateOrderStatus);

module.exports = router;
