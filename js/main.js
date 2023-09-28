const display = document.getElementById("display");
const numButtons = document.querySelectorAll(".num-btn");
const opButtons = document.querySelectorAll(".op-btn");
const clearButton = document.getElementById("borrar");
const equalsButton = document.getElementById("igual");
const historyDiv = document.getElementById("history");

let currentInput = "0";
let currentOperator = "";
let previousValue = 0;
let currentExpression = "";

// Función para agregar el resultado al historial
function addToHistory(operation) {
    historyDiv.innerHTML += `<div>${operation}</div>`;
}

// Funciones para guardar resultado
function updateDisplay() {
    display.value = currentInput;
}
function loadState() {
    const savedState = localStorage.getItem("calculatorState");
    if (savedState) {
        const state = JSON.parse(savedState);
        currentInput = state.currentInput;
        currentOperator = state.currentOperator;
        previousValue = state.previousValue;
        updateDisplay();
    }
}
function saveState() {
    const state = {
        currentInput: currentInput,
        currentOperator: currentOperator,
        previousValue: previousValue
    };
    localStorage.setItem("calculatorState", JSON.stringify(state));
}
loadState();

// Agregando evento a los botones
numButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (currentInput === "0") {
            currentInput = button.textContent;
        } else {
            currentInput += button.textContent;
        }
        updateDisplay();
    });
});
opButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (currentOperator !== "") {
            performCalculation();
        }
        currentOperator = button.textContent;
        previousValue = parseFloat(currentInput);
        currentInput = "0";
    });
});
equalsButton.addEventListener("click", () => {
    if (currentOperator !== "") {
        performCalculation();
        currentInput = previousValue.toString();
        currentOperator = "";
        updateDisplay();
        saveState();
    }
});
clearButton.addEventListener("click", () => {
    currentInput = "0";
    currentOperator = "";
    previousValue = 0;
    updateDisplay();
});

// Funciones de botones de calculos
async function performCalculation() {
    const currentValue = parseFloat(currentInput);
    let result;
    const operator = currentOperator;
    switch (operator) {
        case "+":
            result = previousValue + currentValue;
            break;
        case "-":
            result = previousValue - currentValue;
            break;
        case "*":
            result = previousValue * currentValue;
            break;
        case "/":
            result = previousValue / currentValue;
            break;
    }
    
    const formattedDateTime = new Date().toLocaleString();
    
    // Genera un ID de usuario aleatorio entre 1 y 10
    const randomUserId = Math.floor(Math.random() * 10) + 1;
    
    // Crea una cadena de operación antes de la solicitud fetch
    const operation = `${previousValue} ${operator} ${currentValue} = ${result} (${formattedDateTime})`;

    // Hacer una solicitud GET a JSONPlaceholder para obtener un usuario al azar
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${randomUserId}`);
        if (!response.ok) {
            throw new Error('error de respuesta');
        }
        const user = await response.json();
        addToHistory(`${operation} - Usuario: ${user.name}`);
    } catch (error) {
        console.error('Error al recibir datos:', error);
        addToHistory(`${operation} - Error al recibir datos de usuario`);
    }

    currentExpression = result.toString();
}
