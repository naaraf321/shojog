describe("Mock Exam Flow", () => {
  beforeEach(() => {
    // Login before each test
    cy.login("test@example.com", "password123");
  });

  it("should navigate to the mock exam page", () => {
    cy.navigateTo("/mock-exam");
    cy.get("[data-cy=exam-heading]").should("be.visible");
  });

  it("should display subject selection options", () => {
    cy.navigateTo("/mock-exam");
    cy.get("[data-cy=subject-selection]").should("be.visible");
    cy.get("[data-cy=subject-option]").should("have.length.at.least", 1);
  });

  it("should display institution-based exams", () => {
    cy.navigateTo("/mock-exam");
    cy.get("[data-cy=institution-tab]").click();
    cy.get("[data-cy=institution-option]").should("have.length.at.least", 1);
  });

  it("should start an exam after selection", () => {
    cy.navigateTo("/mock-exam");
    cy.get("[data-cy=subject-option]").first().click();
    cy.get("[data-cy=start-exam-button]").click();
    cy.url().should("include", "/mock-exam/");
    cy.get("[data-cy=question-display]").should("be.visible");
    cy.get("[data-cy=timer]").should("be.visible");
  });

  it("should navigate between questions", () => {
    // Assume we're already in an exam
    cy.navigateTo("/mock-exam/1"); // Example exam ID
    cy.get("[data-cy=next-question]").click();
    cy.get("[data-cy=question-number]").should("contain", "2");
    cy.get("[data-cy=prev-question]").click();
    cy.get("[data-cy=question-number]").should("contain", "1");
  });

  it("should mark questions for review", () => {
    cy.navigateTo("/mock-exam/1"); // Example exam ID
    cy.get("[data-cy=mark-for-review]").click();
    cy.get("[data-cy=question-sidebar]").find("[data-cy=marked-question]").should("be.visible");
  });

  it("should submit exam and show results", () => {
    cy.navigateTo("/mock-exam/1"); // Example exam ID
    // Answer some questions first
    cy.get("[data-cy=option]").first().click();
    cy.get("[data-cy=next-question]").click();
    cy.get("[data-cy=option]").first().click();

    // Submit exam
    cy.get("[data-cy=submit-exam]").click();
    cy.get("[data-cy=confirm-submit]").click();

    // Check results page
    cy.url().should("include", "/results");
    cy.get("[data-cy=results-summary]").should("be.visible");
    cy.get("[data-cy=score-display]").should("be.visible");
  });
});
