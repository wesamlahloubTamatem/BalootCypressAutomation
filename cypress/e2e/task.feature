
Feature: Practice Automation Task

  Background:
    Given navigate to practice automation website

  Scenario: navigate to practice automation and Assert Thinking in HTML book exist along with its price
    Then Assert "Thinking in HTML" book exist and has a price of "₹400.00"

  Scenario: Click on Add to Basket for Thinking in HTML book and Assert the data for item added to the cart
    When click on Add to basket for "Thinking in HTML" book
    And click on Basket icon that has "1 item" which should cost "₹400.00"
    Then Assert added product name is "Thinking in HTML" with quantity of "1" for the price of "₹400.00" and a total of "₹400.00"
    And The Basket Total should be "₹400.00" with a tax of "₹8.00" and a total of "₹408.00"
    And click on proceed checkout button

    Scenario: Navigate to Billing Details page and assert form displayed
    When click on Add to basket for "Thinking in HTML" book
    And click on Basket icon that has "1 item" which should cost "₹400.00"
    And click on proceed checkout button
    Then form with title "Billing Details" should be displayed







