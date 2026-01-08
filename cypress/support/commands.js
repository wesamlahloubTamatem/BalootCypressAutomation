//Cypress Custom commands to be reused in the tests


Cypress.Commands.add('step', (name) => {
    cy.allure().step(name);
  });
  
// Add a simple command to write a log/attachment into allure-results
Cypress.Commands.add('allureLog', (name, content) => {
  const filename = `log-${Date.now()}.txt`;
  const body = `== ${name} ==\n${typeof content === 'string' ? content : JSON.stringify(content, null, 2)}\n`;
  return cy.task('writeAllureFile', { filename, content: body }).then(() => {
    // also attach to current Allure test
    try {
      cy.allure().attachment(name, body, 'text/plain');
    } catch (e) {
      // ignore if allure API not available in this context
    }
  });
});

// Attach AUT console to Allure on-demand from test code: cy.attachAutConsole('name')
Cypress.Commands.add('attachAutConsole', (name = 'aut-console') => {
  return cy.window({ log: false }).then((win) => {
    const logs = (win && win.__allure_console__) ? win.__allure_console__.join('\n') : '';
    if (logs && logs.length) {
      cy.allure().attachment(name, logs, 'text/plain');
      const filename = `console-${Date.now()}-${name}.log`;
      return cy.task('writeAllureFile', { filename, content: logs });
    }
    return null;
  });
});