const Table = require('../models/Table');

const createTable = async (req, res) => {
  try {
    const { tableNumber, label } = req.body;

    if (!tableNumber) {
      return res.status(400).json({ message: 'Please provide a table number' });
    }

    const existingTable = await Table.findOne({ tableNumber: parseInt(tableNumber), owner: req.user.id });
    if (existingTable) {
      return res.status(400).json({ message: 'Table with this number already exists' });
    }

    const qrCodeUrl = `${process.env.FRONTEND_URL}/menu?table=${tableNumber}&owner=${req.user.id}`;

    const table = await Table.create({
      tableNumber: parseInt(tableNumber),
      label,
      qrCodeUrl,
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      table
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTables = async (req, res) => {
  try {
    const tables = await Table.find({ owner: req.user.id }).sort({ tableNumber: 1 });

    res.status(200).json({
      success: true,
      count: tables.length,
      tables
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { tableNumber, label, isActive } = req.body;

    let table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (table.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this table' });
    }

    let qrCodeUrl = table.qrCodeUrl;
    if (tableNumber && parseInt(tableNumber) !== table.tableNumber) {
      qrCodeUrl = `${process.env.FRONTEND_URL}/menu?table=${tableNumber}&owner=${req.user.id}`;
    }

    table = await Table.findByIdAndUpdate(id, {
      tableNumber: tableNumber ? parseInt(tableNumber) : table.tableNumber,
      label,
      isActive,
      qrCodeUrl
    }, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      table
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findById(id);

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (table.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this table' });
    }

    await Table.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Table deleted'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTable,
  getTables,
  updateTable,
  deleteTable
};