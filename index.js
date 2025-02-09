const buttonElement = document.querySelector('.js-button');
const contentUpdate = document.querySelector('.right-section');
const yearValue = document.querySelector('.js-year');
const interestPercentage = document.querySelector('.js-interest');
const clearButton = document.querySelector('.js-clear');
const mortgageInput = document.querySelector('.js-mortgage-amount');
const mortgageTypeRadios = document.querySelectorAll('input[name="mortgage-type"]');
const errorButton = document.querySelector('.error-msg');
const inputError = document.querySelectorAll('input[type="text"]');

function mortgageAmount() {
  const mortgageAmount = parseFloat(mortgageInput.value);
  const year = parseFloat(yearValue.value);
  const annualInterestRate = parseFloat(interestPercentage.value);
  const selectedType = document.querySelector('input[name="mortgage-type"]:checked')?.value;
  let isEmpty = false;

  inputError.forEach(input => {
    if (input.value.trim() === "") {
      isEmpty = true;
    }
  });

  if (isEmpty || !selectedType) {
    errorButton.innerHTML = "Please fill in all fields and select a mortgage type.";
    errorButton.style.display = "block";
    contentUpdate.innerHTML = ` 
      <img src="images/illustration-empty.svg">
      <h2>Results shown here</h2>
      <p class="result-para">Complete the form and click “calculate repayments” to see what 
      your monthly repayments would be.</p>
    `;
    return null; 
  }
  errorButton.innerHTML = "";
  errorButton.style.display = "none";
  const monthlyRate = annualInterestRate / 100 / 12;
  const totalPayments = year * 12;
  let monthlyPayment = 0;
  let totalRepayment = 0;

  if (selectedType === "repayment") {
    if (monthlyRate > 0) {
      monthlyPayment =
        (mortgageAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else {
      monthlyPayment = mortgageAmount / totalPayments;
    }
    totalRepayment = monthlyPayment * totalPayments;
  } else if (selectedType === "interest-only") {
    monthlyPayment = mortgageAmount * monthlyRate;
    totalRepayment = mortgageAmount + (monthlyPayment * totalPayments);
  }

  return {
    monthlyPayment: monthlyPayment.toFixed(2),
    totalRepayment: totalRepayment.toFixed(2),
    selectedType
  };
}

function clear() {
  mortgageInput.value = "";
  yearValue.value = "";
  interestPercentage.value = "";

  mortgageTypeRadios.forEach(radio => radio.checked = false);

  contentUpdate.innerHTML = ` 
    <img src="images/illustration-empty.svg">
    <h2>Results shown here</h2>
    <p class="result-para">Complete the form and click “calculate repayments” to see what 
    your monthly repayments would be.</p>
  `;
}

clearButton.addEventListener("click", () => {
  clear();
});

buttonElement.addEventListener("click", (event) => {
  event.preventDefault();
  const result = mortgageAmount();
  if (!result) return;

  const { monthlyPayment, totalRepayment, selectedType } = result;

  contentUpdate.innerHTML = ` 
  <section class="result-section">
    <h2>Your results</h2>
    <p class="result-para">
      Your results are shown below based on the information you provided. 
      To adjust the results, edit the form and click “calculate repayments” again.
    </p>
    
    <div class="result-div">
      <div>
        <p class="div-p">Your ${selectedType === "repayment" ? "monthly repayments" : "monthly interest-only payments"}</p>
        <p class="monthly-repayments">£${monthlyPayment}</p>
      </div>
      <hr>
      <div> 
        <p class="div-p">Total ${selectedType === "repayment" ? "you'll repay over the term" : "cost including principal"}</p>
        <p class="repay-para">£${totalRepayment}</p>
      </div>
    </div>
  </section>`;
});