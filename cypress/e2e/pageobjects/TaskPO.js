/* global cy */
import TaskLocators from "../locators/TaskLocators";
import LoginLocators from "../locators/loginLocators";

function NavigateWebsite() {
  cy.visit("https://qa-vipbaloot.cgp.one/#/home");
}

function LoginUsingMethodSelection(method) {
  cy.contains(method).click();
}

function FillCredsEmail(email, password) {
  cy.get(TaskLocators.EmailInput).type(email + "{enter}");
  cy.wait(1000);
  cy.get(TaskLocators.PasswordInput).type(password + "{enter}");
}

function AssertLobbyNameIsVisible(lobbyName) {
  cy.contains(lobbyName).should("be.visible");
}



export default {
  NavigateWebsite,
  LoginUsingMethodSelection,
  FillCredsEmail,
  AssertLobbyNameIsVisible,
};
