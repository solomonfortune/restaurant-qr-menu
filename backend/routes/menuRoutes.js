const express = require('express');
const {
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
} = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

const router = express.Router();

router.get('/public', getPublicMenu);
router.use(protect);

router.route('/categories').get(getCategories).post(createCategory);
router.route('/categories/:id').put(updateCategory).delete(deleteCategory);
router.route('/items').get(getMenuItems).post(upload.single('image'), createMenuItem);
router.route('/items/:id').put(upload.single('image'), updateMenuItem).delete(deleteMenuItem);
router.patch('/items/:id/toggle', toggleAvailability);

module.exports = router;
