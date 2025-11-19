require('dotenv').config();
const mongoose = require('mongoose');
const db = require('./db'); // MongoDB-based DB functions
require('./events/logger'); // Initialize event logger
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper to ask questions
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, answer => resolve(answer.trim())));
}

// Menu
async function menu() {
  console.log(`
===== NodeVault =====
1. Add Record
2. List Records
3. Update Record
4. Delete Record
5. Exit
6. Search Records
7. Sort Records
8. Export Data
9. View Vault Statistics
=====================
  `);

  const ans = await askQuestion('Choose option: ');

  switch (ans) {
    case '1':
      const name = await askQuestion('Enter name: ');
      const value = await askQuestion('Enter value: ');
      await db.addRecord({ name, value });
      break;

    case '2':
      const records = await db.listRecords();
      if (!records.length) console.log('No records found.');
      else records.forEach(r => console.log(`ID: ${r._id} | Name: ${r.name} | Value: ${r.value}`));
      break;

    case '3':
      const updateId = await askQuestion('Enter record ID to update: ');
      const newName = await askQuestion('New name: ');
      const newValue = await askQuestion('New value: ');
      const updated = await db.updateRecord(updateId, newName, newValue);
      console.log(updated ? '✅ Record updated!' : '❌ Record not found.');
      break;

    case '4':
      const deleteId = await askQuestion('Enter record ID to delete: ');
      const deleted = await db.deleteRecord(deleteId);
      console.log(deleted ? '🗑️ Record deleted!' : '❌ Record not found.');
      break;

    case '5':
      console.log('👋 Exiting NodeVault...');
      rl.close();
      await mongoose.disconnect();
      return;

    case '6':
      const keyword = await askQuestion('Enter search keyword: ');
      await db.searchRecords(keyword);
      break;

    case '7':
      const field = (await askQuestion('Choose field to sort by (name/created): ')).toLowerCase();
      const order = (await askQuestion('Choose order (asc/desc): ')).toLowerCase();
      await db.sortRecords(field, order);
      break;

    case '8':
      await db.exportVaultData();
      break;

    case '9':
      await db.viewVaultStats();
      break;

    default:
      console.log('❌ Invalid option.');
  }

  menu();
}

// Connect to MongoDB and start the app
async function startApp() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    await menu();
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  }
}

startApp();

