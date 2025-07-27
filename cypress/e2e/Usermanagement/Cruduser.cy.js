import { loginPage } from '../Pages/loginPage';
import { adminUsersPage } from '../Pages/adminUsersPage';

describe('OrangeHRM - Admin User Management (CRUD)', () => {
  const testUser = {
    employeeName: 'Orange  Test',
    role: 'Admin',
    username: `User_${Date.now()}`, // Unique username per run
    status: 'Enabled',
    password: 'Test@12345',
  };

  beforeEach(() => {
    // Login before each test
    loginPage.visit();
    loginPage.login('Admin', 'admin123');
    adminUsersPage.navigate();
  });

  context('Create User Scenarios', () => {
    it('should create a new user successfully', () => {
      adminUsersPage.clickAddUser();
      adminUsersPage.fillUserForm(testUser);
      adminUsersPage.save();
      adminUsersPage.assertToastMessage('Successfully Saved');
      adminUsersPage.searchUser(testUser.username);
      adminUsersPage.assertUserExists(testUser.username);
    });

    it('should prevent creating a user with an existing username', () => {
      adminUsersPage.clickAddUser();
      adminUsersPage.fillUserForm({ ...testUser, username: 'Admin' }); // Duplicate username
      adminUsersPage.save();
      cy.get('.oxd-input-field-error-message')
        .should('be.visible')
        .and('contain.text', 'Already exists');
    });

    it('should display validation errors when required fields are left empty', () => {
      adminUsersPage.clickAddUser();
      adminUsersPage.save();
      cy.get('.oxd-input-field-error-message')
        .should('be.visible')
        .and('contain.text', 'Required');
    });
  });

  context('Read & Search Scenarios', () => {
    it('should search for an existing user by username', () => {
      adminUsersPage.searchUser('Admin');
      adminUsersPage.assertUserExists('Admin');
    });
  });

  context('Update User Scenarios', () => {
    it('should update the status of an existing user', () => {
      adminUsersPage.searchUser(testUser.username);
      adminUsersPage.editFirstUser('Disabled');
      adminUsersPage.assertToastMessage('Successfully Updated');
    });
  });

  context('Delete User Scenarios', () => {
    it('should delete an existing user successfully', () => {
      adminUsersPage.searchUser(testUser.username);
      adminUsersPage.deleteFirstUser();
      adminUsersPage.assertToastMessage('Successfully Deleted');
      adminUsersPage.searchUser(testUser.username);
      adminUsersPage.assertNoResults();
    });
  });
});
