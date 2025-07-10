document.addEventListener('DOMContentLoaded', () => {
    const calculatorDisplay = document.getElementById('calculator-display');
    const calculatorButtons = document.querySelectorAll('.calc-btn');
    let currentInput = '0';
    let operator = null;
    let firstOperand = null;
    let waitingForSecondOperand = false;

    /**
     * Updates the calculator display with the current input.
     */
    function updateDisplay() {
        calculatorDisplay.value = currentInput;
    }

    /**
     * Resets the calculator to its initial state.
     */
    function resetCalculator() {
        currentInput = '0';
        operator = null;
        firstOperand = null;
        waitingForSecondOperand = false;
        updateDisplay();
    }

    /**
     * Handles digit input.
     * @param {string} digit - The digit pressed (0-9).
     */
    function inputDigit(digit) {
        if (waitingForSecondOperand) {
            currentInput = digit;
            waitingForSecondOperand = false;
        } else {
            // Prevent multiple leading zeros
            currentInput = currentInput === '0' ? digit : currentInput + digit;
        }
        updateDisplay();
    }

    /**
     * Handles decimal point input.
     * @param {string} dot - The decimal point character ('.').
     */
    function inputDecimal(dot) {
        // If an operator was just pressed, start a new number with "0."
        if (waitingForSecondOperand) {
            currentInput = '0.';
            waitingForSecondOperand = false;
            updateDisplay();
            return;
        }
        // Only add a decimal if one doesn't already exist in the current input
        if (!currentInput.includes(dot)) {
            currentInput += dot;
        }
        updateDisplay();
    }

    /**
     * Handles operator input (+, -, *, /, =).
     * @param {string} nextOperator - The operator pressed.
     */
    function handleOperator(nextOperator) {
        const inputValue = parseFloat(currentInput);

        // If an operator was just pressed and another operator is pressed, update the operator
        if (operator && waitingForSecondOperand) {
            operator = nextOperator;
            return;
        }

        // If this is the first operand, store it
        if (firstOperand === null) {
            firstOperand = inputValue;
        } else if (operator) {
            // If there's a previous operator, perform the calculation
            const result = performCalculation[operator](firstOperand, inputValue);

            // Handle potential division by zero
            if (!isFinite(result)) {
                currentInput = "Error";
                firstOperand = null;
                operator = null;
                waitingForSecondOperand = false;
                updateDisplay();
                return;
            }

            currentInput = String(result);
            firstOperand = result;
        }

        waitingForSecondOperand = true;
        operator = nextOperator;
        updateDisplay();
    }

    /**
     * Object containing functions for performing calculations based on operator.
     */
    const performCalculation = {
        '/': (first, second) => first / second,
        '*': (first, second) => first * second,
        '+': (first, second) => first + second,
        '-': (first, second) => first - second,
        '=': (first, second) => second // For equals, the second operand becomes the result
    };

    // Add event listeners to all calculator buttons
    calculatorButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const { value } = event.target.dataset; // Get the data-value attribute

            switch (value) {
                case 'C':
                    resetCalculator();
                    break;
                case 'DEL':
                    // Remove the last character, or set to '0' if empty
                    currentInput = currentInput.slice(0, -1) || '0';
                    updateDisplay();
                    break;
                case '.':
                    inputDecimal(value);
                    break;
                case '/':
                case '*':
                case '+':
                case '-':
                case '=':
                    handleOperator(value);
                    break;
                default:
                    // It's a digit
                    inputDigit(value);
                    break;
            }
        });
    });

    // Initialize display on load
    updateDisplay();
});