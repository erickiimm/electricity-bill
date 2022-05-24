// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


const electricityBillService = require('./electricity-bill-service.js');
let $ = jQuery = require('jquery');
var Chart = require('chart.js');
var chartLine = null;

$(function() {

  // Form Validation
  var forms = document.querySelectorAll('.needs-validation');  
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        
        if (!form.checkValidity()) { // if not valid
          event.preventDefault() // Preserves values in the form
          event.stopPropagation()
        } else { // if not valid
          event.preventDefault() // Preserves values in the form
          calculate();
        }
                  
        form.classList.add('was-validated')
        
      }, false);
  });

});

function calculate() {
  // Get values from the form
  var numberUnits = $('#numberUnits').val();
  var billingPeriod = $('#billingPeriod').val();

  // calculate value to be VAT
  var amountBillWithoutVAT = electricityBillService.calculeAmountBillWithoutVAT(numberUnits, billingPeriod);
  // calculates total amount with VAT
  var totalPayableAmountIncludingVAT  = electricityBillService.calculeTotalPayableAmountIncludingVAT(amountBillWithoutVAT);

  // Populates the values in the form
  // toFixed(2) => Rounds decimal values to two places and returns a String
  $("#amountBillWithoutVAT").val("Amount of Bill without VAT: " + amountBillWithoutVAT.toFixed(2) );
  $("#totalPayableAmountIncludingVAT").val("Total payable amount including VAT (13.5%): " + totalPayableAmountIncludingVAT.toFixed(2) ); 
  

  // Create variables(lists)
  var listLabels = [];
  var listAmountBillWithoutVAT = [];
  var listTotalPayableAmountIncludingVAT = [];

  // Calculates the values up to the "period" informed (Demonstrates the evolution in the graph)
  for(i=0; i<billingPeriod; i++) {
    // Current Period for Calculation
    var day = i + 1;
    // Calculates VAT set value for the Current Period
    var partialAmountBillWithoutVAT = electricityBillService.calculeAmountBillWithoutVAT(numberUnits, day);
    // Calculates total amount with VAT for the Current Period
    var partialTotalPayableAmountIncludingVAT  = electricityBillService.calculeTotalPayableAmountIncludingVAT(partialAmountBillWithoutVAT);

    // Populates the lists with the calculated values
    // toFixed(2) => Rounds decimal values to two places and returns a String
    listLabels.push( day );
    listAmountBillWithoutVAT.push( partialAmountBillWithoutVAT.toFixed(2) );
    listTotalPayableAmountIncludingVAT.push( partialTotalPayableAmountIncludingVAT.toFixed(2) );
  }
  
  // With the lists populated, let's populate the chart...
  populateChart(listLabels, listAmountBillWithoutVAT, listTotalPayableAmountIncludingVAT);
}


function populateChart(listLabels, listAmountBillWithoutVAT, listTotalPayableAmountIncludingVAT) {
  // If the graph already exists on the screen then delete it to update the values
  if(chartLine!=null){
    chartLine.destroy();
  }

  // Get the chart in the form
  var ctx = document.getElementById('chart').getContext('2d');

  // population chart
  chartLine = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',
      // The data for our dataset
      data: {
      labels: listLabels, // List of days (period)
      datasets: [
        {
            label: 'Amount of Bill without VAT',
            backgroundColor: 'Gold',
            borderColor: 'Gold',
            data: listAmountBillWithoutVAT // List of calculated values without Vat
        },
        {
          label: 'Total payable amount including VAT',
          backgroundColor: 'Red',
          borderColor: 'Red',
          data: listTotalPayableAmountIncludingVAT // List of values calculated with Vat
        }
      ]
      },
      // Configuration options go here
      options: {}
  });
}
