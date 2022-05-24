

function calculeAmountBillWithoutVAT(numberUnits, billingPeriod) {
    // using a unit rate (flat rate of 20 cents per unit)
    const unitRate = 0.20;
    // standing charges at a rate of 4 cents per day 
    const standingCharges = 0.04;

    return (numberUnits * unitRate) + (billingPeriod * standingCharges);
}
    
function calculeTotalPayableAmountIncludingVAT(amountBillWithoutVAT) {
    // VAT
    const vat = 13.5;
  
    return amountBillWithoutVAT + (amountBillWithoutVAT * vat / 100);
}

module.exports = { calculeAmountBillWithoutVAT, calculeTotalPayableAmountIncludingVAT };
