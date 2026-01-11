const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;
const { allureCypress } = require("allure-cypress/reporter");

module.exports = defineConfig({
  projectId: '8x7xn5',
  e2e: {
    defaultCommandTimeout: 10000,

    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on('file:preprocessor', createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));

      // Allure reporter
      allureCypress(on, config, {
        resultsDir: "allure-results",
      });

      return config;
    },

    specPattern: 'cypress/e2e/**/*.feature',

    video: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    trashAssetsBeforeRuns: false,  // keep videos for passed & failed
  }
});
