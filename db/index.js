const mongoose = require('mongoose');
const Record = require('./recordModel'); // Mongoose model
const fs = require('fs');
const path = require('path');

const backupPath = path.join(__dirname, '../data/vault.json');

// Helper to update backup
async function updateBackup() {
    const allRecords = await Record.find().exec();
    fs.writeFileSync(backupPath, JSON.stringify(allRecords, null, 2));
    console.log('Backup updated successfully!');
}

// Add a new record
async function addRecord({ name, value }) {
    const record = new Record({ name, value });
    await record.save();
    await updateBackup();
    console.log('✅ Record added successfully!');
    return record;
}

// List all records
async function listRecords() {
    return await Record.find().sort({ created: 1 }).exec();
}

// Update a record by ID
async function updateRecord(id, newName, newValue) {
    const record = await Record.findByIdAndUpdate(
        id,
        { name: newName, value: newValue },
        { new: true }
    ).exec();
    await updateBackup();
    return record;
}

// Delete a record by ID
async function deleteRecord(id) {
    const record = await Record.findByIdAndDelete(id).exec();
    await updateBackup();
    return record;
}

// Search records by name or ID
async function searchRecords(keyword) {
    const regex = new RegExp(keyword, 'i');
    const records = await Record.find({ $or: [{ name: regex }, { _id: keyword }] }).exec();

    if (records.length === 0) console.log('No records found.');
    else {
        console.log(`Found ${records.length} record(s):`);
        records.forEach((rec, index) => {
            console.log(`${index + 1}. ID: ${rec._id} | Name: ${rec.name} | Created: ${rec.created}`);
        });
    }
    return records;
}

// Sort records
async function sortRecords(field, order) {
    const sortField = field === 'name' ? 'name' : 'created';
    const sortOrder = order === 'desc' ? -1 : 1;
    const records = await Record.find().sort({ [sortField]: sortOrder }).exec();

    console.log('Sorted Records:');
    records.forEach((rec, index) => {
        console.log(`${index + 1}. ID: ${rec._id} | Name: ${rec.name} | Created: ${rec.created}`);
    });
    return records;
}

// Export records to export.txt
async function exportVaultData() {
    const records = await listRecords();
    const date = new Date();
    const header = `Exported on: ${date.toLocaleString()}\nTotal Records: ${records.length}\nFile: export.txt\n\n`;
    const content = records.map(rec => `ID: ${rec._id} | Name: ${rec.name} | Created: ${rec.created}`).join('\n');
    const output = header + content;

    fs.writeFileSync(path.join(__dirname, '../export.txt'), output, 'utf-8');
    console.log('Data exported successfully to export.txt');
}

// View vault statistics
async function viewVaultStats() {
    const records = await listRecords();
    if (records.length === 0) {
        console.log('Vault is empty.');
        return;
    }

    const totalRecords = records.length;
    const lastModified = new Date();
    const longestName = records.reduce((a, b) => a.name.length > b.name.length ? a : b);
    const earliest = records.reduce((a, b) => a.created < b.created ? a : b);
    const latest = records.reduce((a, b) => a.created > b.created ? a : b);

    console.log('Vault Statistics:\n--------------------------');
    console.log(`Total Records: ${totalRecords}`);
    console.log(`Last Modified: ${lastModified.toLocaleString()}`);
    console.log(`Longest Name: ${longestName.name} (${longestName.name.length} characters)`);
    console.log(`Earliest Record: ${earliest.created.toISOString().split('T')[0]}`);
    console.log(`Latest Record: ${latest.created.toISOString().split('T')[0]}`);
}

module.exports = {
    addRecord,
    listRecords,
    updateRecord,
    deleteRecord,
    searchRecords,
    sortRecords,
    exportVaultData,
    viewVaultStats
};

