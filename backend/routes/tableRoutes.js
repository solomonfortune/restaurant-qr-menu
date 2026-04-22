const express = require('express');
const router = express.Router();
const { createTable, getTables, updateTable, deleteTable } = require('../controllers/tableController');
const auth = require('../middleware/authMiddleware');

router.route('/')
  .get(auth, getTables)
  .post(auth, createTable);

router.route('/:id')
  .put(auth, updateTable)
  .delete(auth, deleteTable);

module.exports = router;