import TaskLocators from "../locators/TaskLocators";

function NavigateWebsite() {
  cy.visit("https://practice.automationtesting.in/");
}


function AssertCardExists(expectedBookName, expectedBookPrice) {

  //Asserting book exist using contains
  cy.get(TaskLocators.BOOKS_GENERAL_LOCATORS).contains('h3', expectedBookName).then((bookInfo) => {

    //Asserting book name
    cy.get(bookInfo).should('be.visible').invoke('text').should('equal', expectedBookName);

    //Asserting book price
    cy.get(bookInfo).parents('li').find(TaskLocators.BOOK_PRICE).children(':not(del)').invoke('text').should('equal', expectedBookPrice);
  });
}

// Clicking on Add to Basket for Thinking in HTML book
function clickOnNeededBook(expectedBookName) {
  cy.get(TaskLocators.BOOKS_GENERAL_LOCATORS).contains('h3', expectedBookName).parents('li').find(TaskLocators.ADD_TO_BASKET_BTN).should('contain.text', 'Add to basket').click();
}

// Clicking on Shopping Cart
function clickBasketIcon(numberOfItems, PriceOfItems) {

  // Asserting Basket content
  cy.get(TaskLocators.BASKET_ICON).within((BasketIconData) => {
    cy.get(BasketIconData).find(TaskLocators.EXTERNAL_BASKET_ICON_ITEMS).should('have.text', numberOfItems);
    cy.get(BasketIconData).find(TaskLocators.EXTERNAL_BASKET_ICON_AMOUT).should('have.text', PriceOfItems);
  });

  // Clicking on Basket Icon
  cy.get(TaskLocators.MENU_ICON).click();
  cy.get(TaskLocators.BASKET_ICON).click();

}

// Asserting Item added to cart with its details
function AssertBasketDetails(itemName, quantity, price, total) {

  // Asserting Item Name
  cy.get(TaskLocators.PRODUCT_NAME).invoke('text').should('contain', itemName);

  // Asserting Price
  cy.get(TaskLocators.PRODUCT_PRICE).invoke('text').should('contain', price);

  // Asserting Quantity
  cy.get(TaskLocators.PRODUCT_QUANTITY).find('input').invoke('val').should('equal', quantity);

  // Asserting Total
  cy.get(TaskLocators.PRODUCT_TOTAL).invoke('text').should('contain', total);

}

// Asserting Basket Details
function AssertBasketTotal(subTotal, tax, total) {

  cy.get(TaskLocators.BASKET_TOTALS_SUBTOTAL).within(() => {
    cy.get('th').should('have.text', 'Subtotal');
    cy.get('td').should('have.text', subTotal);
  });

  cy.get(TaskLocators.BASKET_TOTALS_TAX).within(() => {
    cy.get('th').should('have.text', 'Tax');
    cy.get('td').should('have.text', tax);
  });

  cy.get(TaskLocators.BASKET_TOTALS_TOTAL).within(() => {
    cy.get('th').should('have.text', 'Total');
    cy.get('td').should('contain.text', total);
  });
}

function clickProceedToCheckout() {
  cy.get(TaskLocators.PROCEED_TO_CHECKOUT_BTN).click();
}

function AssertBillingDetailsForm(expectedTitle) {

  //Assert Billing Details title
  cy.get(TaskLocators.BILLING_DETAILS_FORM_TITLE).find('h3').invoke('text').should('equal', expectedTitle);

  //Assert Billing details form fields using a loop
  const elementsToAssert = [
    { locator: TaskLocators.FIRST_NAME, fieldName: 'First Name *' },
    { locator: TaskLocators.LAST_NAME, fieldName: 'Last Name *' },
    { locator: TaskLocators.COMPANY_NAME, fieldName: 'Company Name' },
    { locator: TaskLocators.EMAIL_ADDRESS, fieldName: 'Email Address *' },
    { locator: TaskLocators.PHONE_NUMBER, fieldName: 'Phone *' },
    { locator: TaskLocators.COUNTRY, fieldName: 'Country *' },
    { locator: TaskLocators.ADDRESS, fieldName: 'Address *' },
    { locator: TaskLocators.CITY, fieldName: 'Town / City *' },
    { locator: TaskLocators.STATE, fieldName: 'State / County *' },
    { locator: TaskLocators.POSTAL_CODE, fieldName: 'Postcode / ZIP *' },

  ];
  
  elementsToAssert.forEach(({ locator, fieldName }) => {
    cy.get(`${locator}`).should('contain.text', fieldName);
  });
}


export default {
  NavigateWebsite,
  AssertCardExists,
  clickOnNeededBook,
  clickBasketIcon,
  AssertBasketDetails,
  AssertBasketTotal,
  clickProceedToCheckout,
  AssertBillingDetailsForm,
};
