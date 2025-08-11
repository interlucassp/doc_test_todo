// backend/server.js
const app = require("./index");
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 To-Do App rodando em http://localhost:${PORT}`));
