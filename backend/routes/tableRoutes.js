const express = require('express');
const { createTable, getTables, updateTable, deleteTable } = require('../controllers/tableController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getTables).post(createTable);
router.route('/:id').put(updateTable).delete(deleteTable);

module.exports = router;
