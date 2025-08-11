const request = require("supertest");
const app = require("../index");

describe("Regressão API To-Do App", () => {
  let fakeId = 999999;

  test("CT005 - Criar tarefa com título vazio (POST /tasks)", async () => {
    const res1 = await request(app).post("/tasks").send({ title: "" });
    expect(res1.statusCode).toBe(400);
    expect(res1.body).toHaveProperty("error");

    const res2 = await request(app).post("/tasks").send({ title: "   " });
    expect(res2.statusCode).toBe(400);
    expect(res2.body).toHaveProperty("error");
  });

  test("CT006 - Atualizar tarefa inexistente (PUT /tasks/:id)", async () => {
    const res = await request(app)
      .put(`/tasks/${fakeId}`)
      .send({ completed: 1 });
    expect(res.statusCode).toBe(200);
    expect(res.body.updated).toBe(0);
  });

  test("CT007 - Deletar tarefa inexistente (DELETE /tasks/:id)", async () => {
    const res = await request(app).delete(`/tasks/${fakeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.deleted).toBe(0);
  });

  test("CT008 - Listar tarefas em banco vazio (GET /tasks)", async () => {
    // Primeiro deletar todas tarefas (limpar banco)
    const resGet = await request(app).get("/tasks");
    const tasks = resGet.body;
    for (const t of tasks) {
      await request(app).delete(`/tasks/${t.id}`);
    }
    // Verificar que lista está vazia
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });
});
