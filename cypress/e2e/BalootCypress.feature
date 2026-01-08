
Feature: Automation Cypress Proof of concept    


  Scenario: Check that logging in using email works correctly
  Given navigate to vip baloot qa website
  And choose to login using "عبرالبريد الإلكتروني" method
  When fill the credentials with email "wesam.lahloub@tamatem.co" and password "123123"
  Then check that the game opens and the player can see "جلسة تدريبية" lobby on the screen






