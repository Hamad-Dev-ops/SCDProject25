const mongoose = require('mongoose');

// Define the schema for a record
const RecordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
  created: { type: Date, default: Date.now }
});

// Create and export the Mongoose model
module.exports = mongoose.model('Record', RecordSchema);

