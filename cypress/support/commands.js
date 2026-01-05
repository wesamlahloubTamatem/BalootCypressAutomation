
//Cypress Custom commands to be reused in the tests


Cypress.Commands.add('step', (name) => {
    cy.allure().step(name);
  });