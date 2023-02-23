describe("Navigation", () => {
  it("open home page", () => {
    cy.visit("http://localhost:3000/");
    cy.get("button").contains("more");
  });
});

describe("Home page", () => {
  it("open home page and sees title Awesome People", () => {
    cy.visit("http://localhost:3000/");
    cy.get("h1").contains("Awesome People");
  });
  it("Load more button should appear", () => {
    cy.visit("http://localhost:3000/");
    cy.get("button").contains("more");
  });
});

describe("Navigation to about page", () => {
  it("open about page", () => {
    cy.visit("http://localhost:3000/");
    cy.get(".nav-link").contains("About").click();
    cy.get("h1").contains("Who am I?");
  });
});

describe("Data fetching test", () => {
  it("When application is loaded for the first time, it should display 20 persons", () => {
    cy.visit("http://localhost:3000");
    cy.get("button").contains("Load more").click();
    cy.get(".person").should("have.length", 20);
  });
  it("When load more is clicked, it should load another 20 persons and display 40 persons", () => {
    cy.visit("http://localhost:3000");
    cy.get("button").contains("Load more").click();
    cy.get(".person").should("have.length", 40);
  });
});
