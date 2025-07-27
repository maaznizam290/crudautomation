/// <reference types="cypress" />

class AdminUsersPage {
  /**
   * Navigate to Admin > User Management page
   */
  navigate() {
    cy.get(':nth-child(1) > .oxd-main-menu-item')
      .should('be.visible')
      .click();
    cy.url().should('include', '/admin/viewSystemUsers');
  }

  /**
   * Search for a user by username
   * @param {string} username - Username to search
   */
  searchUser(username) {
    cy.get('input[placeholder="Username"]')
      .clear()
      .type(username);
    cy.get('button[type="submit"]').click();
  }

  /**
   * Click the "Add" button to open the Add User form
   */
  clickAddUser() {
    cy.get('.orangehrm-header-container > .oxd-button')
      .should('be.visible')
      .and('contain.text', 'Add')
      .click();
  }

  /**
   * Fill the Add/Edit user form dynamically
   * @param {object} options - User form options
   */
  fillUserForm({
    role = 'Admin',
    employeeName = 'Orange  Test',
    status = 'Enabled',
    username = this._generateRandomUsername(),
    password = 'Test@12345',
  } = {}) {
    // Select User Role
    cy.get(':nth-child(1) > .oxd-input-group .oxd-select-text').click();
    cy.contains('.oxd-select-option', role).click({ force: true });

    // Type employee name & wait for suggestion list
    cy.get('.oxd-autocomplete-text-input > input').type(employeeName);
    cy.get('.oxd-autocomplete-dropdown', { timeout: 10000 })
      .should('be.visible')
      .find('.oxd-autocomplete-option')
      .first()
      .should('contain.text', employeeName)
      .click();

    // Select Status
    cy.get(':nth-child(3) > .oxd-input-group .oxd-select-text').click();
    cy.contains('.oxd-select-option', status).click({ force: true });

    // Fill Username
    cy.xpath(
      '/html/body/div/div[1]/div[2]/div[2]/div/div/form/div[1]/div/div[4]/div/div[2]/input'
    ).clear().type(username);

    // Fill Password & Confirm Password
    cy.get('.user-password-cell .oxd-input').clear().type(password);
    cy.get(':nth-child(2) > .oxd-input-group .oxd-input').clear().type(password);

    this.save();
    return username; // return username for chaining
  }

  /**
   * Save form
   */
  save() {
    cy.get('.oxd-button--secondary')
      .should('be.visible')
      .click();
  }

  /**
   * Edit the first user in the table
   * @param {string} newStatus - New status (Enabled/Disabled)
   */
  editFirstUser(newStatus) {
    cy.get('.oxd-icon-button').first().click();
    cy.get('.oxd-select-text').eq(1).click();
    cy.contains('.oxd-select-option', newStatus).click();
    this.save();
  }

  /**
   * Delete the first user in the table
   */
  deleteFirstUser() {
    cy.get('.oxd-icon-button.oxd-table-cell-action-space').eq(1).click();
    cy.get('.oxd-button--label-danger').click();
  }

  /**
   * Assert a toast message appears
   * @param {string} expectedText
   */
  assertToastMessage(expectedText) {
    cy.get('.oxd-text--toast-message', { timeout: 10000 })
      .should('be.visible')
      .and('contain.text', expectedText);
  }

  /**
   * Assert a user exists in the table
   * @param {string} username
   */
  assertUserExists(username) {
    cy.get('.oxd-table-cell').should('contain.text', username);
  }

  /**
   * Assert no results found
   */
  assertNoResults() {
    cy.get('.oxd-table-body').should('contain.text', 'No Records Found');
  }

  /**
   * Generate random username
   * @param {string} prefix
   */
  _generateRandomUsername(prefix = 'AutoUser') {
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${randomStr}`;
  }
}

export const adminUsersPage = new AdminUsersPage();
