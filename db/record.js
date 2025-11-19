const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    created: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Record', RecordSchema);

