// backend/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const dbFile = path.join(__dirname, "data.sqlite");
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error("Erro ao abrir DB:", err);
});
module.exports = db;
