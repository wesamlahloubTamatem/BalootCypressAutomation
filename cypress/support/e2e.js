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

// Load existing commands
import './commands';

// Capture browser console messages and keep them per-window/spec
Cypress.on('window:before:load', (win) => {
  try {
    win.__captured_console__ = [];
    const origConsole = win.console || {};
    ['log', 'info', 'warn', 'error', 'debug'].forEach((level) => {
      const orig = origConsole[level] ? origConsole[level].bind(origConsole) : () => {};
      win.console[level] = function (...args) {
        try {
          const msg = args.map(a => {
            try { return typeof a === 'string' ? a : JSON.stringify(a); } catch (e) { return String(a); }
          }).join(' ');
          const timestamp = new Date().toISOString();
          win.__captured_console__.push(`[${timestamp}] [${level}] ${msg}`);
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

// Allure integration removed: no attachments are added in afterEach.

// helper used above in the browser chain to sanitize names (simple inline)
function pathSafe(p) {
  return (p || '').replace(/[^a-zA-Z0-9_\-\.]/g, '_');
}