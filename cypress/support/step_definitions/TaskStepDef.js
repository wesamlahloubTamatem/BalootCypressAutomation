const { Given, When, Then } = require("@badeball/cypress-cucumber-preprocessor");
import TaskPO from "../../e2e/pageobjects/TaskPO";

//User Creates a new account as a Job seeker
Given("navigate to practice automation website", () => {
  TaskPO.NavigateWebsite();
});

Then("Assert {string} book exist and has a price of {string}", (expectedBookName, expectedBookPrice) => {
  TaskPO.AssertCardExists(expectedBookName, expectedBookPrice);
});

When("click on Add to basket for {string} book", (expectedBookName) => {
  TaskPO.clickOnNeededBook(expectedBookName);
});

When("click on Basket icon that has {string} which should cost {string}", (numberOfItems, PriceOfItems) => {
  TaskPO.clickBasketIcon(numberOfItems, PriceOfItems);
});

Then("Assert added product name is {string} with quantity of {string} for the price of {string} and a total of {string}", (itemName, quantity, price, total) => {
  TaskPO.AssertBasketDetails(itemName, quantity, price, total);
});

Then("The Basket Total should be {string} with a tax of {string} and a total of {string}", (subTotal, tax, total) => {
  TaskPO.AssertBasketTotal(subTotal, tax, total);
});

Then("click on proceed checkout button", () => {
  TaskPO.clickProceedToCheckout();
});

Then("form with title {string} should be displayed", (expectedTitle) => {
  TaskPO.AssertBillingDetailsForm(expectedTitle);
});





