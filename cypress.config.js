const fs = require('fs');
const path = require('path');
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

      // Allure reporter - map Cucumber tags into Allure labels (e.g. @severity:critical or @priority:high)
      allureCypress(on, config, {
        resultsDir: "allure-results",
        useCucumberTags: true,
      });

      // --- Added: build a scenario-title -> tags map by parsing .feature files ---
      const featuresDir = path.join(process.cwd(), 'cypress', 'e2e');
      const tagsMap = new Map();

      function parseFeatureFile(filePath) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split(/\r?\n/);
        let pendingTags = [];
        for (const raw of lines) {
          const line = raw.trim();
          if (!line) {
            // keep pendingTags (tags usually sit immediately above Scenario)
            continue;
          }
          if (line.startsWith('@')) {
            // tags can be space separated: @tag1 @key:value
            pendingTags = line.split(/\s+/).map(t => t.replace(/^@/, ''));
            continue;
          }
          const m = line.match(/^Scenario(?: Outline)?:\s*(.*)/i);
          if (m) {
            const title = m[1].trim();
            if (title) tagsMap.set(title, pendingTags.slice());
            pendingTags = [];
          }
        }
      }

      function collectFeatureFiles(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
          const p = path.join(dir, e.name);
          if (e.isDirectory()) collectFeatureFiles(p);
          else if (e.isFile() && p.endsWith('.feature')) parseFeatureFile(p);
        }
      }

      try {
        if (fs.existsSync(featuresDir)) collectFeatureFiles(featuresDir);
      } catch (err) {
        // ignore parse errors, mapping is best-effort
      }

      // --- Added: after run, augment allure-results JSON files with labels from tagsMap ---
      on('after:run', async () => {
        const resultsDir = path.join(process.cwd(), 'allure-results');
        if (!fs.existsSync(resultsDir)) return;
        try {
          const files = fs.readdirSync(resultsDir);
          for (const f of files) {
            if (!f.endsWith('.json')) continue;
            const fp = path.join(resultsDir, f);
            let j;
            try {
              j = JSON.parse(fs.readFileSync(fp, 'utf8'));
            } catch {
              continue;
            }
            const testName = j.name || j.title;
            if (!testName) continue;
            const scenarioTags = tagsMap.get(testName);
            if (!scenarioTags || !Array.isArray(scenarioTags) || scenarioTags.length === 0) continue;
            j.labels = j.labels || [];
            for (const rawTag of scenarioTags) {
              const [key, ...rest] = rawTag.split(':');
              const value = rest.length ? rest.join(':') : 'true';
              // avoid duplicates
              const exists = (j.labels || []).some(l => l.name === key && String(l.value) === String(value));
              if (!exists) j.labels.push({ name: key, value });
            }
            try {
              fs.writeFileSync(fp, JSON.stringify(j, null, 2), 'utf8');
            } catch (err) {
              // ignore write errors
            }
          }
        } catch (err) {
          // best-effort only
        }
      });

      return config;
    },

    specPattern: 'cypress/e2e/**/*.feature',

    video: true,
    videosFolder: 'cypress/videos',
    screenshotsFolder: 'cypress/screenshots',
    trashAssetsBeforeRuns: true,
  }
});
