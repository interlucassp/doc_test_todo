// frontend/app.js
const API_URL = "/tasks"; // servido pelo backend static

async function fetchTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  const list = document.getElementById("taskList");
  list.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = task.completed ? "done" : "";
    li.innerHTML = `
      <label>
        <input type="checkbox" data-id="${task.id}" ${task.completed ? "checked" : ""}>
        <span class="title">${escapeHtml(task.title)}</span>
      </label>
      <button class="del" data-id="${task.id}">🗑️</button>
    `;
    list.appendChild(li);
  });
  attachListeners();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.innerText = text;
  return div.innerHTML;
}

function attachListeners() {
  document.querySelectorAll("input[type=checkbox]").forEach(cb => {
    cb.onchange = async (e) => {
      const id = e.target.dataset.id;
      await fetch(`/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: e.target.checked ? 1 : 0 })
      });
      fetchTasks();
    };
  });
  document.querySelectorAll("button.del").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      await fetch(`/tasks/${id}`, { method: "DELETE" });
      fetchTasks();
    };
  });
}

document.getElementById("addBtn").onclick = async () => {
  const input = document.getElementById("taskInput");
  const title = input.value.trim();
  if (!title) return alert("Digite uma tarefa");
  await fetch("/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  });
  input.value = "";
  fetchTasks();
};

fetchTasks();
