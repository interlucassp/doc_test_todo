describe("To-Do App - Testes E2E", () => {
  const apiUrl = "http://localhost:3000";

  beforeEach(() => {
    // Limpa banco via API antes de cada teste
    cy.request("GET", `${apiUrl}/tasks`).then((res) => {
      res.body.forEach((task) => {
        cy.request("DELETE", `${apiUrl}/tasks/${task.id}`);
      });
    });
    cy.visit("http://localhost:5500/index.html"); // ajuste se usar outra porta
  });

  it("CT001 - Criar nova tarefa", () => {
    cy.get("#new-task-input").type("Testar tarefa Cypress{enter}");
    cy.get("#task-list").contains("Testar tarefa Cypress").should("exist");
  });

  it("CT002 - Marcar tarefa como concluída", () => {
    cy.get("#new-task-input").type("Tarefa para concluir{enter}");
    cy.get("#task-list input[type=checkbox]").check();
    cy.get("#task-list li.completed").contains("Tarefa para concluir");
  });

  it("CT003 - Deletar tarefa", () => {
    cy.get("#new-task-input").type("Tarefa para deletar{enter}");
    cy.get("#task-list button.delete-btn").click();
    cy.get("#task-list").should("not.contain", "Tarefa para deletar");
  });

  it("CT004 - Criar tarefa sem título deve falhar", () => {
    cy.get("#new-task-input").type("   {enter}");
    // Verifica se nenhuma nova tarefa foi criada
    cy.get("#task-list li").should("have.length", 0);
  });
});
