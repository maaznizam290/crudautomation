/// <reference types="cypress" />

describe('OrangeHRM API Suite - Login & Users CRUD', () => {

  let authToken;
  let userId;

  const baseApi = '/web/index.php/api/v2';
  const adminCredentials = { username: 'Admin', password: 'admin123' };

// generates the username with a timestamp to ensure uniqueness
  const generateUsername = (prefix = 'ApiUser') => {
    return `${prefix}_${Date.now().toString().slice(-6)}`;
  };

  // --- LOGIN TESTS CASE ---
  it('Should authenticate with valid credentials and return a token', () => {
    cy.request('POST', `${baseApi}/login`, adminCredentials)
      .then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('token');
        authToken = res.body.token;
      });
  });

  it('Should reject login with invalid password', () => {
    cy.request({
      method: 'POST',
      url: `${baseApi}/login`,
      failOnStatusCode: false,
      body: { username: 'Admin', password: 'wrongPassword' }
    }).then((res) => {
      expect(res.status).to.eq(401);
      expect(res.body).to.have.property('error');
    });
  });

  // --- CREATE USER  TEST CASE ---
  it('Should create a new Admin user successfully', () => {
    const newUser = {
      username: generateUsername(),
      password: 'Test@12345',
      status: 'Enabled',
      userRole: 'Admin',
      empName: 'Orange  Test'
    };

    cy.request({
      method: 'POST',
      url: `${baseApi}/admin/users`,
      headers: { Authorization: `Bearer ${authToken}` },
      body: newUser
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body).to.have.property('id');
      userId = res.body.id;
    });
  });

  it('Should not allow user creation without a username', () => {
    cy.request({
      method: 'POST',
      url: `${baseApi}/admin/users`,
      headers: { Authorization: `Bearer ${authToken}` },
      failOnStatusCode: false,
      body: { password: 'Test@12345', status: 'Enabled', userRole: 'Admin', empName: 'Orange  Test' }
    }).then((res) => {
      expect(res.status).to.eq(400);
      expect(res.body).to.have.property('error');
    });
  });

  // --- READ USER TEST CASE ---
  it('Should fetch details of the created user', () => {
    cy.request({
      method: 'GET',
      url: `${baseApi}/admin/users/${userId}`,
      headers: { Authorization: `Bearer ${authToken}` }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('username');
    });
  });

  it('Should return 404 for non-existent user ID', () => {
    cy.request({
      method: 'GET',
      url: `${baseApi}/admin/users/9999999`,
      headers: { Authorization: `Bearer ${authToken}` },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.have.property('error');
    });
  });

  // --- UPDATE USER TEST CASE ---
  it('Should update user information successfully', () => {
    const updatedUsername = generateUsername('EditedApiUser');
    cy.request({
      method: 'PUT',
      url: `${baseApi}/admin/users/${userId}`,
      headers: { Authorization: `Bearer ${authToken}` },
      body: { username: updatedUsername, status: 'Disabled' }
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.have.property('username', updatedUsername);
    });
  });

  // --- DELETE USER TEST CASE---
  it('Should delete the created user', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseApi}/admin/users/${userId}`,
      headers: { Authorization: `Bearer ${authToken}` }
    }).then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it('Should return 404 when trying to delete an already removed user', () => {
    cy.request({
      method: 'DELETE',
      url: `${baseApi}/admin/users/${userId}`,
      headers: { Authorization: `Bearer ${authToken}` },
      failOnStatusCode: false
    }).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body).to.have.property('error');
    });
  });

});
