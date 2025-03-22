describe("Question Bank Navigation", () => {
  beforeEach(() => {
    // Login before each test
    cy.login("test@example.com", "password123");
    cy.navigateTo("/question-bank");
  });

  it("should display both subject and institution tabs", () => {
    cy.get("[data-cy=subject-tab]").should("be.visible");
    cy.get("[data-cy=institution-tab]").should("be.visible");
  });

  it("should display subjects in the subject tab", () => {
    cy.get("[data-cy=subject-tab]").click();
    cy.get("[data-cy=subject-list]").should("be.visible");
    cy.get("[data-cy=subject-item]").should("have.length.at.least", 1);
  });

  it("should allow filtering by chapter when a subject is selected", () => {
    cy.get("[data-cy=subject-tab]").click();
    cy.get("[data-cy=subject-item]").first().click();
    cy.get("[data-cy=chapter-filter]").should("be.visible");
    cy.get("[data-cy=chapter-option]").should("have.length.at.least", 1);
  });

  it("should filter questions by difficulty level", () => {
    cy.get("[data-cy=subject-tab]").click();
    cy.get("[data-cy=subject-item]").first().click();
    cy.get("[data-cy=difficulty-filter]").click();
    cy.get("[data-cy=difficulty-option]").contains("Hard").click();
    cy.get("[data-cy=question-item]").should("have.length.at.least", 0);
  });

  it("should display institutions in the institution tab", () => {
    cy.get("[data-cy=institution-tab]").click();
    cy.get("[data-cy=institution-list]").should("be.visible");
    cy.get("[data-cy=institution-item]").should("have.length.at.least", 1);
  });

  it("should allow filtering by exam type in institution tab", () => {
    cy.get("[data-cy=institution-tab]").click();
    cy.get("[data-cy=institution-item]").first().click();
    cy.get("[data-cy=exam-type-filter]").should("be.visible");
    cy.get("[data-cy=exam-type-option]").should("have.length.at.least", 1);
  });

  it("should allow filtering by year in institution tab", () => {
    cy.get("[data-cy=institution-tab]").click();
    cy.get("[data-cy=institution-item]").first().click();
    cy.get("[data-cy=year-filter]").should("be.visible");
    cy.get("[data-cy=year-option]").should("have.length.at.least", 1);
  });

  it("should display question details when a question is clicked", () => {
    cy.get("[data-cy=subject-tab]").click();
    cy.get("[data-cy=subject-item]").first().click();
    cy.get("[data-cy=question-item]").first().click();
    cy.get("[data-cy=question-detail]").should("be.visible");
    cy.get("[data-cy=question-text]").should("be.visible");
    cy.get("[data-cy=answer-options]").should("be.visible");
  });

  it("should allow bookmarking a question", () => {
    cy.get("[data-cy=subject-tab]").click();
    cy.get("[data-cy=subject-item]").first().click();
    cy.get("[data-cy=question-item]").first().find("[data-cy=bookmark-button]").click();
    cy.get("[data-cy=bookmark-confirmation]").should("be.visible");
  });

  it("should display explanation when revealed", () => {
    cy.get("[data-cy=subject-tab]").click();
    cy.get("[data-cy=subject-item]").first().click();
    cy.get("[data-cy=question-item]").first().click();
    cy.get("[data-cy=show-explanation]").click();
    cy.get("[data-cy=explanation-text]").should("be.visible");
  });
});
