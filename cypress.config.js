const { defineConfig } = require("cypress");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;

module.exports = defineConfig({
  projectId: '8x7xn5',
  experimentalStudio: true,
  e2e: {
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor', createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));
      allureWriter(on, config); // Allure writer to generate results

      // Add Chromium launch flags to mitigate renderer crashes (bad_message.cc) on some systems
      on('before:browser:launch', (browser = {}, launchOptions) => {
        try {
          if (browser.family === 'chromium' || browser.name === 'electron' || browser.name === 'chrome') {
            launchOptions.args = launchOptions.args || [];
            launchOptions.args.push(
              '--disable-gpu',
              '--disable-software-rasterizer',
              '--no-sandbox',
              '--disable-dev-shm-usage',
              '--disable-features=VizDisplayCompositor' // optional stability flag for windows users
            );
          }
        } catch (e) {
          // swallow any errors to avoid breaking startup
        }
        return launchOptions;
      });

      return config;
    },
    specPattern: 'cypress/e2e/**/*.feature', // Path for the feature files
    video: true, // Enable video recording for testcases
  },
});