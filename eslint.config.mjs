import js from "@eslint/js";
import globals from "globals";
import cypress from "eslint-plugin-cypress";
import { defineConfig } from "eslint/config";

export default defineConfig([
  /**
   * ------------------------------------------------------
   * 1️⃣ Global JavaScript Rules (Entire Codebase)
   * ------------------------------------------------------
   */
  {
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["node_modules", "dist", "coverage"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    plugins: {
      js
    },
    rules: {
      ...js.configs.recommended.rules,

      "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
      "no-restricted-imports": [
        "error",
        { "patterns": ["../*", "../../*"] }
      ]
    }
  },

  /**
   * ------------------------------------------------------
   * 2️⃣ Cypress Execution Layer (Tests ONLY)
   * ------------------------------------------------------
   */
  {
    files: ["cypress/e2e/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...(cypress?.environments?.globals?.globals || {})
      }
    },
    plugins: {
      cypress
    },
    rules: {
      ...cypress.configs.recommended.rules,

      "no-restricted-syntax": [
        {
          "selector": "CallExpression[callee.name='it']",
          "message": "Direct 'it' blocks are forbidden. Use Cucumber scenarios only."
        },
        {
          "selector": "CallExpression[callee.object.name='cy'][callee.property.name='get'] > Literal",
          "message": "Do not use raw string selectors in cy.get(). Use a POM locator variable instead."
        },
      ],

      // ❌ Removed "cypress/no-unnecessary-waiting": "error"
      "cypress/no-force": "warn"
    }
  },

  /**
   * ------------------------------------------------------
   * 3️⃣ Page Object Model (POM) Enforcement
   * ------------------------------------------------------
   */
  {
    files: ["cypress/e2e/pages/**/*.js"],
    rules: {
      "no-restricted-syntax": [
        {
          "selector": "CallExpression[callee.name='it']",
          "message": "Tests are not allowed inside POM files."
        }
      ],
      "no-restricted-imports": [
        { "patterns": ["**/*.feature"] }
      ]
    }
  },

  /**
   * ------------------------------------------------------
   * 4️⃣ Locators Discipline (AI Locator Signature)
   * ------------------------------------------------------
   */
  {
    files: ["cypress/e2e/locators/**/*.js"],
    rules: {
      "id-match": [
        "error",
        ".*EditMe",
        { "onlyDeclarations": true }
      ]
    }
  },

  /**
   * ------------------------------------------------------
   * 5️⃣ Cucumber Mandatory Presence (Framework-Level)
   * ------------------------------------------------------
   */
  {
    files: ["cypress/**/*.js"],
    rules: {
      "no-restricted-imports": [
        { "patterns": ["**/*.spec.js"] }
      ]
    }
  }
]);
