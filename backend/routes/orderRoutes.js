const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrderStatus, getDashboardStats } = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

router.post('/', createOrder);
router.get('/', auth, getOrders);
router.patch('/:id/status', auth, updateOrderStatus);
router.get('/stats', auth, getDashboardStats);

module.exports = router;