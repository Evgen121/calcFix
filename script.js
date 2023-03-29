const getLocal = document.querySelector('.getlocal')
const result = document.querySelector('.result');
const clearLocal = document.querySelector('.clearlocal')
const calculator = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null,
};
let numberArray = [];


function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculator;
    // Перезаписати `displayValue`, якщо поточне значення '0', інакше додати до нього

    if (waitingForSecondOperand === true) {
        calculator.displayValue = digit;
        calculator.waitingForSecondOperand = false;
    } else {
        calculator.displayValue = displayValue === '0' ? digit : displayValue + digit;
    }



}

function inputDecimal(dot) {
    // додавання тільки одніеї десяткової коми в значені
    if (calculator.waitingForSecondOperand === true) {
        calculator.displayValue = "0."
        calculator.waitingForSecondOperand = false;
        return
    }

    // Якщо властивість `displayValue` не містить десяткової коми
    if (!calculator.displayValue.includes(dot)) {
        // Додавання десяткової коми
        calculator.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    // Деструктуруємо властивості об'єкта калькулятора
    const { firstOperand, displayValue, operator } = calculator
    // `parseFloat` перетворює вміст рядка `displayValue`
    // до числа з плаваючою комою
    const inputValue = parseFloat(displayValue);
    // перевірити, що `firstOperand` є нульовим і що `inputValue`
    // не є значенням `NaN`
    if (operator && calculator.waitingForSecondOperand) {
        // Оновлення властивості firstOperand
        calculator.operator = nextOperator;
        return;
    }


    if (firstOperand == null && !isNaN(inputValue)) {
        calculator.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);

        calculator.displayValue = `${parseFloat(result.toFixed(7))}`;
        calculator.firstOperand = result;


        // пушим до локалсторадж
        const local = (arr) => {
            let localItem = [firstOperand, operator, inputValue, '=', result]
            let joinItem = localItem.join('')
            arr.push(joinItem)

        }
        local(numberArray)
        localStorage.setItem('array', JSON.stringify(numberArray))

    }

    calculator.waitingForSecondOperand = true;
    calculator.operator = nextOperator;
}
//  вичеслення 
function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        return firstOperand / secondOperand;
    }
    return secondOperand;

}



function resetCalculator() {
    calculator.displayValue = '0';
    calculator.firstOperand = null;
    calculator.waitingForSecondOperand = false;
    calculator.operator = null;
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');

    display.value = calculator.displayValue;
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', event => {
    // Доступ до вибраного елемента
    const { target } = event;
    const { value } = target;
    // Перевірити, чи клацнутий елемент є кнопкою.
    // Якщо ні, вийти з функції
    if (!target.matches('button')) {
        return;
    }

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        default:
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
            }
    }

    updateDisplay();

});
//отримання локалсторедж

getLocal.addEventListener('click', () => {

    if (localStorage.length == 0) {
        console.log('ти не маешь локал сторедж')
    } else {
        let get = localStorage.getItem('array')

        let itemLocal = JSON.parse(get)

        let itemLength = itemLocal.length || false
        console.log("items:", itemLength)
        result.innerHTML = itemLocal.slice('', 5)
        console.log(itemLocal.slice('', 5))

    }
})
// чиСтим локал сторадж
clearLocal.addEventListener('click', () => {
    localStorage.removeItem('array')
    result.innerHTML = ''
})

