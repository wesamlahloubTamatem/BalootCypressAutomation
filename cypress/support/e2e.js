// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Load existing commands and Allure plugin
import './commands';
import '@shelex/cypress-allure-plugin';

// Capture browser console messages and keep them per-window/spec
Cypress.on('window:before:load', (win) => {
  try {
    win.__allure_console__ = [];
    const origConsole = win.console || {};
    ['log', 'info', 'warn', 'error', 'debug'].forEach((level) => {
      const orig = origConsole[level] ? origConsole[level].bind(origConsole) : () => {};
      win.console[level] = function (...args) {
        try {
          const msg = args.map(a => {
            try { return typeof a === 'string' ? a : JSON.stringify(a); } catch (e) { return String(a); }
          }).join(' ');
          const timestamp = new Date().toISOString();
          win.__allure_console__.push(`[${timestamp}] [${level}] ${msg}`);
        } catch (e) {
          // no-op
        }
        return orig(...args);
      };
    });
  } catch (e) {
    // ignore
  }
});

// After each test attach console logs and the spec video to Allure test result
afterEach(function () {
  const test = this.currentTest;
  if (!test) return;
  const safeTitle = (test.title || 'unnamed').replace(/[^a-z0-9_\-\.]/gi, '_');
  // Attach console logs (from AUT) as text attachment to the current test
  cy.window({ log: false }).then((win) => {
    const logs = (win && win.__allure_console__) ? win.__allure_console__.join('\n') : '';
    if (logs && logs.length) {
      // Attach as text via Allure plugin API (this links to current test)
      // eslint-disable-next-line cypress/no-assigning-return-values
      cy.allure().attachment(`console-${safeTitle}.log`, logs, 'text/plain');
      // Also write raw file into allure-results for convenience
      const filename = `console-${Date.now()}-${safeTitle}.log`;
      cy.task('writeAllureFile', { filename, content: logs });
    }
  }).then(() => {
    // Try to attach spec video to current test result (if present)
    const videosFolder = Cypress.config('videosFolder') || 'cypress/videos';
    // Cypress.spec.relative gives path like "e2e/spec.cy.js" — video files are located as videosFolder/<spec.relative>.mp4
    const specRelative = (Cypress.spec && Cypress.spec.relative) ? Cypress.spec.relative : Cypress.spec.name || '';
    const videoPath = `${videosFolder}/${specRelative}.mp4`;
    // First, check if file exists (task uses Node fs)
    return cy.task('fileExists', { filePath: videoPath }).then((exists) => {
      if (!exists) return null;
      // read file as base64 then attach to Allure
      return cy.readFile(videoPath, 'base64', { log: false }).then((b64) => {
        if (b64) {
          // Attach to Allure (fileAttachment expects base64 content)
          cy.allure().fileAttachment(`video-${safeTitle}.mp4`, b64, 'video/mp4');
          // optionally write the video copy into allure-results (redundant with after:spec but harmless)
          const destFilename = `${Date.now()}-${pathSafe(specRelative)}.mp4`;
          // Use writeAllureFile for copying base64 -> write as binary in node via task not implemented; instead rely on after:spec copy
        }
        return null;
      });
    });
  });
});

// helper used above in the browser chain to sanitize names (simple inline)
function pathSafe(p) {
  return (p || '').replace(/[^a-zA-Z0-9_\-\.]/g, '_');
}