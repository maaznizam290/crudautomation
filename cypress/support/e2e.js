import 'cypress-mochawesome-reporter/register';

Cypress.on('uncaught:exception', () => false); // Prevent failures from app errors

// Take screenshot automatically on test failure
Cypress.on('fail', (error, runnable) => {
  cy.screenshot(`${runnable.parent.title} -- ${runnable.title}`);
  throw error;
});
