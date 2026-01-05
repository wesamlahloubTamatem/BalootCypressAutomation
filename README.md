<<<<<<< HEAD
# BalootCypressAutomation
=======
# Automation Cypress Project Complete Environment based on javascript with Cucumber and Page Object Model (POM), Integrated with allure and has a parallel test method, also is a Dockerised project

<span style="color:red">

**Note:** This environment is carefully crafted by Wesam with passionate love for automation and will always be updated to follow *PERFECT* practices in Cypress. Every function here is optimized to execute flawlessly, All function should complete execution within **5-6 seconds**, with a beautifully generated Allure report to showcase the magic.

</span>

## Overview

This project uses **Cypress** for end-to-end testing and incorporates **Cucumber** to implement Behavior-Driven Development (BDD). The **Page Object Model (POM)** design pattern is employed to create a structured and maintainable approach for writing test scripts.

### Key Components

- **Page Objects**:
  - Located in the `page_objects` directory, these files encapsulate the methods that interact with specific parts of the application. For example, `TaskPO.js` contains functions related to tasks and user interactions.

- **Cucumber Features**:
  - The `features` directory contains `.feature` files written in Gherkin syntax. Each feature file outlines scenarios for different functionalities, helping to reuse implementations instead of creating duplicate ones.

- **Step Definitions**:
  - Located in the `step_definitions` directory, these files map the steps in the feature files to the actual implementation using Cypress commands.

- **Custom Commands**:
  - The `commands.js` file includes reusable Cypress commands for common interactions, making the test scripts more concise and maintainable.

## Installation

To set up the project, follow these steps:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/WessamLahloub/automation-web-automation-environment-project
   cd automation-web-automation-environment-project
   ```

2. **Install Dependencies**:
   Make sure you have Node.js and npm installed. Then run the following command to install the required dependencies:
   ```bash
   npm install
   ```

3. **Required Packages**:
   This project requires the following packages:
   - **Cypress**: For end-to-end testing.
   - **Cucumber**: For BDD-style test writing.
   - **@badeball/cypress-cucumber-preprocessor**: Integration of Cucumber with Cypress.
   - **Allure Reports**: For generating detailed test reports.

   These will be installed as part of the `npm install` command, provided they are listed in the `package.json` file.

## Running Tests

1. **To open the Cypress Test Runner and see the test execution (headed)**:
   ```bash
   npx cypress open
   ```

2. **To run tests in headless mode**:
   ```bash
   npx cypress run
   ```

3. **To generate Allure results and view the report**:
   - Run the tests with the following command to generate the `allure-results` folder:
     ```bash
     npm run browser:chrome
     ```
   - Generate and open the Allure report:
     ```bash
     npm run report:allure
     ```

4. **To run tests in parallel mode (Uses chrome and electron browsers):**
   ```bash
   npm run test:parallel
   ```

## Docker Support

This project is Dockerized to ensure a consistent environment for running tests.

1. **Dockerfile**:
   The `Dockerfile` is configured to create a containerized Cypress environment. It uses the official Cypress Docker image as the base and installs project dependencies.

2. **.dockerignore**:
   The `.dockerignore` file is included to exclude unnecessary files and directories (e.g., `node_modules`, logs, etc.) from the Docker build context.

3. **Building the Docker Image**:
   To build the Docker image, use the following command:
   ```bash
   docker build -t cypress-project .
   ```

4. **Running the Docker Container**:
   To run the tests in the Docker container interactively:
   ```bash
   docker run -it cypress-project
   ```

## Project Structure

Here’s an overview of the key directories and files:

- `cypress/`
  - Contains all Cypress test files, including `e2e`, `task.feature` inside e2e, and `support`.

- `page_objects/`
  - Contains Page Object files that define methods for interacting with different parts of the application.

- `step_definitions/`
  - Contains step definition files mapping Gherkin steps to Cypress commands.

- `commands.js`
  - should contain reusable Cypress commands (this project didn't need them).

- `Dockerfile`
  - Defines the Docker image configuration.

- `.dockerignore`
  - Specifies files and directories to exclude from the Docker build context.

## Using Cypress Studio

- Studio is enabled in the project config (experimentalStudio: true). It is an experimental GUI feature to record interactions and generate test code.
- To use Studio:
  1. Run the test runner: npx cypress open
  2. Open a spec from the Test Runner (headed mode).
  3. Click the "Studio" button in the Test Runner to start recording actions.
  4. Interact with the app in the browser; Studio will record steps and offer generated code.
  5. To add assertions, right‑click an element in the App or the Recorder and choose "Add assertion".
  6. Save the generated test edits from the Studio pane when done.

Notes:
- Studio works only in the interactive Test Runner (npx cypress open), not in headless runs.
- It's experimental — keep changes under version control and review generated code before committing.
- If you want to disable Studio, set experimentalStudio: false in cypress.config.js.

## Notes

- Ensure that you have docker desktop and it's running while executing the docker commands
- The project is designed to be extendable and maintainable by following the POM design pattern and using reusable custom commands.
- the parallel testing uses chrome and electron browsers, don't forget to install electron if you don't have it

All Regards, Wessam Lahloub!
>>>>>>> bcf36628 (New Cypress Baloot framework)
