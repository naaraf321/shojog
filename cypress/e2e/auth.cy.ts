describe("Authentication Flow", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display the sign in button on homepage", () => {
    cy.get("[data-cy=signin-button]").should("exist");
  });

  it("should navigate to sign in page on button click", () => {
    cy.get("[data-cy=signin-button]").click();
    cy.url().should("include", "/auth/signin");
  });

  it("should show validation errors on empty form submission", () => {
    cy.visit("/auth/signin");
    cy.get("[data-cy=signin-button]").click();
    cy.get("[data-cy=email-error]").should("be.visible");
    cy.get("[data-cy=password-error]").should("be.visible");
  });

  it("should show error message on incorrect credentials", () => {
    cy.visit("/auth/signin");
    cy.get("[data-cy=email-input]").type("incorrect@example.com");
    cy.get("[data-cy=password-input]").type("wrongpassword");
    cy.get("[data-cy=signin-button]").click();
    cy.get("[data-cy=auth-error]").should("be.visible");
  });

  it("should navigate to sign up page from sign in page", () => {
    cy.visit("/auth/signin");
    cy.get("[data-cy=signup-link]").click();
    cy.url().should("include", "/auth/signup");
  });

  it("should show validation errors on empty sign up form submission", () => {
    cy.visit("/auth/signup");
    cy.get("[data-cy=signup-button]").click();
    cy.get("[data-cy=name-error]").should("be.visible");
    cy.get("[data-cy=email-error]").should("be.visible");
    cy.get("[data-cy=password-error]").should("be.visible");
  });
});
