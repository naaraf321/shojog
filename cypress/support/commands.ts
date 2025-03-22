// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Import Testing Library commands
import "@testing-library/cypress/add-commands";

// Firebase authentication related commands
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/auth/signin");
  cy.get("[data-cy=email-input]").type(email);
  cy.get("[data-cy=password-input]").type(password);
  cy.get("[data-cy=signin-button]").click();
  cy.url().should("include", "/dashboard");
});

// Navigation helpers
Cypress.Commands.add("navigateTo", (path: string) => {
  cy.visit(path);
  cy.url().should("include", path);
});

// Declare global Cypress namespace to add custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      navigateTo(path: string): Chainable<void>;
    }
  }
}
