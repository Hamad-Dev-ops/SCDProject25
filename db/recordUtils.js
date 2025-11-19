function validateRecord(record) {
  if (!record.name || !record.value) throw new Error('Record must have both name and value.');
  return true;
}

function generateId() {
  return Date.now(); // You might not need this with MongoDB (_id is auto-generated)
}

module.exports = { validateRecord, generateId };

