const mongoose = require('mongoose');

// Optional: Sub-schema for structured measurements
const measurementsSchema = new mongoose.Schema({
  chest: { type: String },
  waist: { type: String },
  hip: { type: String },
  length: { type: String },
  shoulder: { type: String },
  sleeve: { type: String }
}, { _id: false }); // Prevents automatic _id in subdocument

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceType: {
    type: String,
    enum: ['Blouse Stitching', 'Skirt', 'Dress', 'Alteration', 'Custom'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  measurements: {
    type: measurementsSchema, // ✅ Changed from String to object schema
    required: false
  },
  address: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'In Progress', 'Ready', 'Delivered'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);
