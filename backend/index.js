// backend/index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./db");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve frontend static files
app.use("/", express.static(path.join(__dirname, "..", "frontend")));

// Inicializa tabela
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )`);
});

// Endpoints API
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/tasks", (req, res) => {
  const { title } = req.body;
  if (!title || !title.trim()) return res.status(400).json({ error: "title required" });
  db.run("INSERT INTO tasks (title) VALUES (?)", [title.trim()], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, title: title.trim(), completed: 0 });
  });
});

app.put("/tasks/:id", (req, res) => {
  const { completed, title } = req.body;
  const updates = [];
  const params = [];
  if (typeof completed !== "undefined") {
    updates.push("completed = ?");
    params.push(completed ? 1 : 0);
  }
  if (typeof title !== "undefined") {
    updates.push("title = ?");
    params.push(title);
  }
  if (updates.length === 0) return res.status(400).json({ error: "no fields to update" });
  params.push(req.params.id);
  db.run(`UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`, params, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ updated: this.changes });
  });
});

app.delete("/tasks/:id", (req, res) => {
  db.run("DELETE FROM tasks WHERE id = ?", req.params.id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = app;
