const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");
import TaskPO from "../../e2e/pageobjects/TaskPO";


Given("navigate to vip baloot qa website", () => {
  TaskPO.NavigateWebsite();
});

Given("choose to login using {string} method", (method) => {
  TaskPO.LoginUsingMethodSelection(method);
});

When("fill the credentials with email {string} and password {string}", (email, password) => {
  TaskPO.FillCredsEmail(email, password);
})

Then("check that the game opens and the player can see {string} lobby on the screen", (lobbyName) => {
  TaskPO.AssertLobbyNameIsVisible(lobbyName);
});






