// backend/tests/api.test.js
const request = require("supertest");
const fs = require("fs");
const path = require("path");

// remove DB file before tests to start clean
const dbFile = path.join(__dirname, "..", "data.sqlite");
if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile);

const app = require("../index");

describe("API To-Do", () => {
  let createdId;

  it("POST /tasks cria tarefa", async () => {
    const res = await request(app).post("/tasks").send({ title: "Estudar QA" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Estudar QA");
    createdId = res.body.id;
  });

  it("GET /tasks lista tarefas", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("PUT /tasks/:id marca completado", async () => {
    const res = await request(app).put(`/tasks/${createdId}`).send({ completed: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.updated).toBe(1);
  });

  it("DELETE /tasks/:id deleta tarefa", async () => {
    const res = await request(app).delete(`/tasks/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.deleted).toBe(1);
  });

  it("POST /tasks com título vazio retorna 400", async () => {
    const res = await request(app).post("/tasks").send({ title: "" });
    expect(res.statusCode).toBe(400);
  });
});
