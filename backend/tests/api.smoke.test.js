const request = require("supertest");
const fs = require("fs");
const path = require("path");

const dbFile = path.join(__dirname, "..", "data.sqlite");

// Apaga DB para rodar testes limpos
beforeAll(() => {
  if (fs.existsSync(dbFile)) fs.unlinkSync(dbFile);
});

const app = require("../index");

describe("Smoke Tests API To-Do App", () => {
  let createdTaskId;

  test("CT001 - Criar tarefa com título válido (POST /tasks)", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Teste Smoke Criar Tarefa" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Teste Smoke Criar Tarefa");
    expect(res.body.completed).toBe(0);
    createdTaskId = res.body.id;
  });

  test("CT002 - Listar tarefas (GET /tasks)", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    // Confirmar que tarefa criada está na lista
    const task = res.body.find(t => t.id === createdTaskId);
    expect(task).toBeDefined();
    expect(task.title).toBe("Teste Smoke Criar Tarefa");
  });

  test("CT003 - Atualizar tarefa para completada (PUT /tasks/:id)", async () => {
    const res = await request(app)
      .put(`/tasks/${createdTaskId}`)
      .send({ completed: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.updated).toBe(1);

    // Verifica no GET se mudou o status
    const res2 = await request(app).get("/tasks");
    const task = res2.body.find(t => t.id === createdTaskId);
    expect(task.completed).toBe(1);
  });

  test("CT004 - Deletar tarefa (DELETE /tasks/:id)", async () => {
    const res = await request(app).delete(`/tasks/${createdTaskId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.deleted).toBe(1);

    // Verifica no GET se foi removida
    const res2 = await request(app).get("/tasks");
    const task = res2.body.find(t => t.id === createdTaskId);
    expect(task).toBeUndefined();
  });
});
