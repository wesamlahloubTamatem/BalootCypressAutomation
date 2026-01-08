# BalootCypressAutomation

# Run Cypress and Allure (minimal)

- Install deps:
  npm install

- Run tests (record video for each spec):
  npm run cypress:run

- Generate and open Allure report in one friendly step:
  npm run allure:report

Notes:
- The Allure CLI (used by `npx allure generate`) requires a Java Runtime (JRE 11+). If Java is missing the helper will attempt to use Docker (if available), or will show clear instructions to install Java or run the Docker command manually.
- If a report already exists in `allure-report`, `npm run allure:report` will serve it at http://localhost:8080 using `npx serve`.
- Console logs from the AUT and videos are attempted to be attached to each test result (see support hooks).
