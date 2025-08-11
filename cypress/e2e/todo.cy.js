// cypress/e2e/todo.cy.js
describe("To-Do App E2E", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Adiciona uma tarefa", () => {
    cy.get("#taskInput").type("Comprar pão");
    cy.get("#addBtn").click();
    cy.contains("Comprar pão").should("exist");
  });

  it("Marca e desmarca uma tarefa", () => {
    cy.get("#taskInput").type("Teste Cypress");
    cy.get("#addBtn").click();
    cy.contains("Teste Cypress").parent().find('input[type="checkbox"]').check();
    cy.contains("Teste Cypress").parent().find('input[type="checkbox"]').uncheck();
  });

  it("Deleta uma tarefa", () => {
    cy.get("#taskInput").type("Tarefa deletável");
    cy.get("#addBtn").click();
    cy.contains("Tarefa deletável").parent().find("button.del").click();
    cy.contains("Tarefa deletável").should("not.exist");
  });
});
