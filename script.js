document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("taxForm");
    const modal = document.getElementById("modal");
    const closeButton = document.querySelector(".close");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        if (validateForm()) {
            const income = parseFloat(document.getElementById("income").value);
            const extraIncome = parseFloat(document.getElementById("extraIncome").value) || 0;
            const deductions = parseFloat(document.getElementById("deductions").value) || 0;
            const age = document.getElementById("age").value;

            const totalIncome = income + extraIncome - deductions;
            const tax = calculateTax(totalIncome, age);
            const netIncome = totalIncome - tax;

            showModal(netIncome);
        }
    });

    closeButton.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    function validateForm() {
        let isValid = true;
        const inputs = form.querySelectorAll("input[type='text'], select");
        inputs.forEach(input => {
            const errorIcon = input.nextElementSibling;
            if (!input.checkValidity()) {
                errorIcon.style.display = "inline";
                input.parentNode.classList.add("invalid");
                isValid = false;
            } else {
                errorIcon.style.display = "none";
                input.parentNode.classList.remove("invalid");
            }
        });

        // Additional check for age dropdown
        const ageSelect = document.getElementById("age");
        const ageErrorIcon = ageSelect.nextElementSibling;
        if (!ageSelect.value) {
            ageErrorIcon.style.display = "inline";
            ageErrorIcon.textContent = "Please select an age";
            ageSelect.parentNode.classList.add("invalid");
            isValid = false;
        } else {
            ageErrorIcon.style.display = "none";
            ageSelect.parentNode.classList.remove("invalid");
        }

        return isValid;
    }

    function calculateTax(totalIncome, age) {
        let tax = 0;

        if (totalIncome > 800000) {
            const taxableAmount = totalIncome - 800000; // Amount over 8 Lakhs
            switch (age) {
                case "<40":
                    tax = 0.3 * taxableAmount; // 30% tax for age < 40
                    break;
                case ">=40&<60":
                    tax = 0.4 * taxableAmount; // 40% tax for age ≥ 40 but < 60
                    break;
                case ">=60":
                    tax = 0.1 * taxableAmount; // 10% tax for age ≥ 60
                    break;
            }
        }

        return tax;
    }

    function showModal(netIncome) {
        const modalContent = document.querySelector(".modal-content");
        modalContent.innerHTML = `
            <div id="result" class="result-box">
                <h3>Your overall income will be</h3> 
                <h3>${netIncome}</h3>
                <h5>after tax deductions</h5>
            </div>
            <button id="closeResult" class="btn btn-primary">Close</button>
        `;
        modal.style.display = "block";

        const closeResultButton = document.getElementById("closeResult");
        closeResultButton.addEventListener("click", function() {
            modal.style.display = "none";
        });
    }

    // Add the (?) symbol next to each heading
    const labels = document.querySelectorAll("label");
    labels.forEach(label => {
        const tooltipMessage = label.getAttribute("data-tooltip");
        if (tooltipMessage) {
            const tooltipSymbol = document.createElement("span");
            tooltipSymbol.textContent = "?";
            tooltipSymbol.className = "tooltip-symbol";
            label.appendChild(tooltipSymbol);

            const tooltipDetail = document.createElement("span");
            tooltipDetail.className = "tooltip-detail";
            tooltipDetail.textContent = tooltipMessage;
            label.appendChild(tooltipDetail);
        }
    });

    // Show/hide tooltip detail when hovering over (?)
    const tooltipSymbols = document.querySelectorAll(".tooltip-symbol");
    tooltipSymbols.forEach(symbol => {
        symbol.addEventListener("mouseover", function() {
            const detail = symbol.nextSibling;
            detail.style.display = "inline";
        });
        symbol.addEventListener("mouseout", function() {
            const detail = symbol.nextSibling;
            detail.style.display = "none";
        });
    });

    // Add event listeners for input fields to handle validation
    const numberInputs = document.querySelectorAll("input[type='text']");
    numberInputs.forEach(input => {
        input.addEventListener("input", function() {
            validateNumberInput(input);
        });
    });

    function validateNumberInput(input) {
        const errorIcon = input.nextElementSibling;
        if (!input.value.match(/^\d*\.?\d*$/)) {
            errorIcon.style.display = "inline";
            errorIcon.textContent = "!";
            errorIcon.setAttribute("data-tooltip", "Please enter numbers only");
        } else {
            errorIcon.style.display = "none";
            errorIcon.removeAttribute("data-tooltip");
        }
    }
});
