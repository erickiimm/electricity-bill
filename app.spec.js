const { _electron: electron } = require('playwright');

const { test, expect } = require('@playwright/test');
const electricityBillService = require('./electricity-bill-service.js');

// To run the tests run the command below: npx playwright test

test('CalculeAmountBillWithoutVAT numberUnits:225, billingPeriod:1', async () => {
  const numberUnits = 225; 
  const billingPeriod = 1;

  var result = electricityBillService.calculeAmountBillWithoutVAT(numberUnits, billingPeriod);

  expect("45.04").toBe( Number(result).toFixed(2) );  
});

test('CalculeAmountBillWithoutVAT numberUnits:225, billingPeriod:15', async () => {
  const numberUnits = 225; 
  const billingPeriod = 15;

  var result = electricityBillService.calculeAmountBillWithoutVAT(numberUnits, billingPeriod);

  expect("45.60").toBe( Number(result).toFixed(2) );  
});

test('CalculeAmountBillWithoutVAT numberUnits:225, billingPeriod:45', async () => {
  const numberUnits = 225; 
  const billingPeriod = 45;

  var result = electricityBillService.calculeAmountBillWithoutVAT(numberUnits, billingPeriod);

  expect("46.80").toBe( Number(result).toFixed(2) );  
});

test('CalculeTotalPayableAmountIncludingVAT numberUnits:225, billingPeriod:1', async () => {
  const numberUnits = 225; 
  const billingPeriod = 1;
  var amountBillWithoutVAT = electricityBillService.calculeAmountBillWithoutVAT(numberUnits, billingPeriod);

  var result = electricityBillService.calculeTotalPayableAmountIncludingVAT(amountBillWithoutVAT);

  expect("51.12").toBe( Number(result).toFixed(2) );  
});

test('CalculeTotalPayableAmountIncludingVAT numberUnits:225, billingPeriod:15', async () => {
  const numberUnits = 225; 
  const billingPeriod = 15;
  var amountBillWithoutVAT = electricityBillService.calculeAmountBillWithoutVAT(numberUnits, billingPeriod);

  var result = electricityBillService.calculeTotalPayableAmountIncludingVAT(amountBillWithoutVAT);

  expect("51.76").toBe( Number(result).toFixed(2) );  
});

test('CalculeTotalPayableAmountIncludingVAT numberUnits:225, billingPeriod:45', async () => {
  const numberUnits = 225; 
  const billingPeriod = 45;
  var amountBillWithoutVAT = electricityBillService.calculeAmountBillWithoutVAT(numberUnits, billingPeriod);

  var result = electricityBillService.calculeTotalPayableAmountIncludingVAT(amountBillWithoutVAT);

  expect("53.12").toBe( Number(result).toFixed(2) );  
});


test('Calculate Front', async () => {
  // Start the application
  const electronApp = await electron.launch({ args: ['main.js'] })

  // Get the application window
  const window = await electronApp.firstWindow()    

  // Set the values in the form
  await window.fill('#numberUnits', '225');
  await window.fill('#billingPeriod', '60');

  // Click on the calculate button
  await window.click('text=Calculate');

  // Gets the Form values that were calculated
  var amountBillWithoutVAT = await window.inputValue('input#amountBillWithoutVAT');
  var totalPayableAmountIncludingVAT = await window.inputValue('input#totalPayableAmountIncludingVAT');

  // Validates if the values corresponding to the form
  expect('Amount of Bill without VAT: 47.40').toBe(amountBillWithoutVAT);
  expect('Total payable amount including VAT (13.5%): 53.80').toBe(totalPayableAmountIncludingVAT);
    
  // Take a screen print (write the file 'app.spec.png') with the execution of the code that populates the fields, calculates and shows the results.
  await window.screenshot({ path: 'app.spec.png' })

  // close app
  await electronApp.close()
});
