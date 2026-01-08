const { defineConfig } = require("cypress");
const allureWriter = require('@shelex/cypress-allure-plugin/writer');
const fs = require('fs');
const path = require('path');
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const createEsbuildPlugin = require("@badeball/cypress-cucumber-preprocessor/esbuild").createEsbuildPlugin;

module.exports = defineConfig({
  projectId: '8x7xn5',
  experimentalStudio: true,
  e2e: {
    // default timeout for all Cypress commands to 10 seconds
    defaultCommandTimeout: 10000,
    
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

      // task used by support/commands to write custom files into allure-results
      on('task', {
        writeAllureFile({ filename, content }) {
          const resultsDir = config.env.allureResults || 'allure-results';
          if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
          const filePath = path.join(resultsDir, filename);
          fs.writeFileSync(filePath, content, { encoding: 'utf8' });
          return null;
        },
        fileExists({ filePath }) {
          return fs.existsSync(filePath);
        }
      });

      // after a spec finishes, copy video (if present) and write the spec results into allure-results
      on('after:spec', (spec, results) => {
        const resultsDir = config.env.allureResults || 'allure-results';
        try {
          if (!fs.existsSync(resultsDir)) fs.mkdirSync(resultsDir, { recursive: true });
          if (results && results.video) {
            const videoPath = results.video;
            const dest = path.join(resultsDir, path.basename(videoPath));
            try { fs.copyFileSync(videoPath, dest); } catch (e) { console.error('copy video failed', e); }
          }
          // write full results for the spec (useful for logs / debugging)
          fs.writeFileSync(path.join(resultsDir, `${path.basename(spec.relative)}.spec-results.json`), JSON.stringify(results || {}, null, 2));
        } catch (e) {
          // keep CI stable if writing fails
          console.error(e);
        }
        return null;
      });

      return config;
    },
    specPattern: 'cypress/e2e/**/*.feature', // Path for the feature files
    video: true, // Enable video recording for testcases
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    env: {
      allureResults: 'allure-results'
    }
  },
});