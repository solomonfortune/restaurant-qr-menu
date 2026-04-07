const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    default: '',
    trim: true,
  },
  qrCodeUrl: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

tableSchema.index({ owner: 1, tableNumber: 1 }, { unique: true });

module.exports = mongoose.model('Table', tableSchema);
