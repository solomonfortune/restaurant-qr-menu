const Table = require('../models/Table');

const buildQrCodeUrl = (tableNumber, ownerId) => (
  `${process.env.FRONTEND_URL}/menu?table=${tableNumber}&owner=${ownerId}`
);

const createTable = async (req, res) => {
  try {
    const { tableNumber, label } = req.body;

    if (!tableNumber) {
      return res.status(400).json({ message: 'tableNumber is required' });
    }

    const table = await Table.create({
      tableNumber: Number(tableNumber),
      label: label || '',
      owner: req.user._id,
      qrCodeUrl: buildQrCodeUrl(Number(tableNumber), req.user._id),
    });

    return res.status(201).json(table);
  } catch (error) {
    const status = error.code === 11000 ? 400 : 500;
    return res.status(status).json({ message: 'Failed to create table', error: error.message });
  }
};

const getTables = async (req, res) => {
  try {
    const tables = await Table.find({ owner: req.user._id }).sort({ tableNumber: 1 });
    return res.status(200).json(tables);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch tables', error: error.message });
  }
};

const updateTable = async (req, res) => {
  try {
    const { tableNumber, label, isActive } = req.body;
    const updateData = {};

    if (typeof tableNumber !== 'undefined') {
      updateData.tableNumber = Number(tableNumber);
      updateData.qrCodeUrl = buildQrCodeUrl(Number(tableNumber), req.user._id);
    }

    if (typeof label !== 'undefined') updateData.label = label;
    if (typeof isActive !== 'undefined') updateData.isActive = isActive;

    const table = await Table.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    return res.status(200).json(table);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update table', error: error.message });
  }
};

const deleteTable = async (req, res) => {
  try {
    const table = await Table.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    return res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to delete table', error: error.message });
  }
};

module.exports = {
  createTable,
  getTables,
  updateTable,
  deleteTable,
};
