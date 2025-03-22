describe("Doubts Forum Interactions", () => {
  beforeEach(() => {
    // Login before each test
    cy.login("test@example.com", "password123");
    cy.navigateTo("/doubts");
  });

  it("should display the questions feed", () => {
    cy.get("[data-cy=questions-feed]").should("be.visible");
    cy.get("[data-cy=question-card]").should("have.length.at.least", 1);
  });

  it("should navigate to ask question page", () => {
    cy.get("[data-cy=ask-question-button]").click();
    cy.url().should("include", "/doubts/ask");
    cy.get("[data-cy=question-form]").should("be.visible");
  });

  it("should require all fields in the question form", () => {
    cy.navigateTo("/doubts/ask");
    cy.get("[data-cy=submit-question]").click();
    cy.get("[data-cy=title-error]").should("be.visible");
    cy.get("[data-cy=subject-error]").should("be.visible");
    cy.get("[data-cy=content-error]").should("be.visible");
  });

  it("should allow selecting subject and chapter", () => {
    cy.navigateTo("/doubts/ask");
    cy.get("[data-cy=subject-dropdown]").click();
    cy.get("[data-cy=subject-option]").first().click();
    cy.get("[data-cy=chapter-dropdown]").should("be.visible");
    cy.get("[data-cy=chapter-dropdown]").click();
    cy.get("[data-cy=chapter-option]").first().click();
  });

  it("should allow adding tags to the question", () => {
    cy.navigateTo("/doubts/ask");
    cy.get("[data-cy=tag-input]").type("test-tag{enter}");
    cy.get("[data-cy=tag-badge]").should("contain", "test-tag");
  });

  it("should allow submitting a valid question", () => {
    cy.navigateTo("/doubts/ask");
    cy.get("[data-cy=title-input]").type("Test Question Title");
    cy.get("[data-cy=subject-dropdown]").click();
    cy.get("[data-cy=subject-option]").first().click();
    cy.get("[data-cy=chapter-dropdown]").click();
    cy.get("[data-cy=chapter-option]").first().click();

    // Use rich text editor - may need adjustment based on actual implementation
    cy.get("[data-cy=content-editor]").find(".ql-editor").type("This is a test question content. How do you solve this problem?");

    cy.get("[data-cy=tag-input]").type("test-tag{enter}");
    cy.get("[data-cy=submit-question]").click();

    // Should redirect to the new question page
    cy.url().should("include", "/doubts/");
    cy.get("[data-cy=question-detail]").should("be.visible");
  });

  it("should display question details when clicked", () => {
    cy.get("[data-cy=question-card]").first().click();
    cy.get("[data-cy=question-detail]").should("be.visible");
    cy.get("[data-cy=question-title]").should("be.visible");
    cy.get("[data-cy=question-content]").should("be.visible");
    cy.get("[data-cy=answer-section]").should("be.visible");
  });

  it("should allow upvoting a question", () => {
    cy.get("[data-cy=question-card]").first().click();
    cy.get("[data-cy=upvote-button]").click();
    cy.get("[data-cy=upvote-count]").should("not.contain", "0");
  });

  it("should allow answering a question", () => {
    cy.get("[data-cy=question-card]").first().click();
    cy.get("[data-cy=answer-editor]").find(".ql-editor").type("This is a test answer.");
    cy.get("[data-cy=submit-answer]").click();
    cy.get("[data-cy=answer-item]").should("contain", "This is a test answer.");
  });

  it("should allow commenting on answers", () => {
    cy.get("[data-cy=question-card]").first().click();
    // Assuming there's already an answer
    cy.get("[data-cy=answer-item]").first().find("[data-cy=add-comment]").click();
    cy.get("[data-cy=comment-input]").type("This is a test comment.");
    cy.get("[data-cy=submit-comment]").click();
    cy.get("[data-cy=comment-item]").should("contain", "This is a test comment.");
  });

  it("should allow following a question", () => {
    cy.get("[data-cy=question-card]").first().click();
    cy.get("[data-cy=follow-button]").click();
    cy.get("[data-cy=follow-button]").should("contain", "Following");
  });
});
