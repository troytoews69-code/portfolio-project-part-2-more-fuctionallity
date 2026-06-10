// ====================================================
// THIS IS WHERE THE CALCULATOR APPLICATION IS LOCATED
// ====================================================

class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.shouldResetScreen = false;
        this.history = this.loadHistory();
        this.init();
    }

    init() {
        this.cacheDOMElements();
        this.attachEventListeners();
        this.updateDisplay();
        this.renderHistory();
    }

    cacheDOMElements() {
        this.currentDisplay = document.getElementById('currentDisplay');
        this.previousDisplay = document.getElementById('previousDisplay');
        this.historyBtn = document.getElementById('historyBtn');
        this.historyPanel = document.getElementById('historyPanel');
        this.historyList = document.getElementById('historyList');
        this.clearHistoryBtn = document.getElementById('clearHistory');
        this.advancedBtn = document.getElementById('advancedBtn');
        this.advancedFunctions = document.getElementById('advancedFunctions');
        this.themeToggle = document.getElementById('themeToggle');

        this.numberBtns = document.querySelectorAll('[data-number]');
        this.operatorBtns = document.querySelectorAll('[data-action]');
    }

    attachEventListeners() {
        // This is where the number buttons are located
        this.numberBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.number !== undefined) {
                    this.appendNumber(btn.dataset.number);
                } else if (btn.dataset.action === 'decimal') {
                    this.appendNumber('.');
                }
            });
        });

        // This is where the operator buttons are located
        this.operatorBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.handleOperation(btn.dataset.action);
            });
        });

        // This is where the history toggle button is located
        this.historyBtn.addEventListener('click', () => {
            this.historyPanel.classList.toggle('show');
        });

        // This is where the clear history button is located
        this.clearHistoryBtn.addEventListener('click', () => {
            this.clearHistory();
        });

        // This is where the advanced toggle button is located
        this.advancedBtn.addEventListener('click', () => {
            this.advancedFunctions.classList.toggle('show');
            this.advancedBtn.classList.toggle('active');
        });

        // This is where the theme toggle button is located
        this.themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const icon = this.themeToggle.querySelector('i');
            icon.className = document.body.classList.contains('light-theme') 
                ? 'fas fa-sun' 
                : 'fas fa-moon';
        });

        // This is where keyboard support is located
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') this.appendNumber(e.key);
        if (e.key === '.') this.appendNumber('.');
        if (e.key === '+') this.handleOperation('add');
        if (e.key === '-') this.handleOperation('subtract');
        if (e.key === '*') this.handleOperation('multiply');
        if (e.key === '/') this.handleOperation('divide');
        if (e.key === 'Enter' || e.key === '=') this.handleOperation('equals');
        if (e.key === 'Escape') this.handleOperation('clear');
        if (e.key === 'Backspace') this.handleOperation('delete');
        if (e.key === '%') this.handleOperation('percent');
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
        }
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        this.updateDisplay();
    }

    handleOperation(action) {
        const current = parseFloat(this.currentOperand);

        switch (action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'equals':
                this.compute();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
            case 'power':
                this.chooseOperation(action);
                break;
            case 'percent':
                this.currentOperand = (current / 100).toString();
                this.updateDisplay();
                break;
            case 'sqrt':
                this.currentOperand = Math.sqrt(current).toString();
                this.addToHistory(`√${current}`, this.currentOperand);
                this.updateDisplay();
                break;
            case 'square':
                this.currentOperand = (current ** 2).toString();
                this.addToHistory(`${current}²`, this.currentOperand);
                this.updateDisplay();
                break;
            case 'inverse':
                this.currentOperand = (1 / current).toString();
                this.addToHistory(`1/${current}`, this.currentOperand);
                this.updateDisplay();
                break;
            case 'factorial':
                this.currentOperand = this.factorial(current).toString();
                this.addToHistory(`${current}!`, this.currentOperand);
                this.updateDisplay();
                break;
            case 'sin':
                this.currentOperand = Math.sin(current * Math.PI / 180).toString();
                this.addToHistory(`sin(${current})`, this.currentOperand);
                this.updateDisplay();
                break;
            case 'cos':
                this.currentOperand = Math.cos(current * Math.PI / 180).toString();
                this.addToHistory(`cos(${current})`, this.currentOperand);
                this.updateDisplay();
                break;
            case 'tan':
                this.currentOperand = Math.tan(current * Math.PI / 180).toString();
                this.addToHistory(`tan(${current})`, this.currentOperand);
                this.updateDisplay();
                break;
            case 'log':
                this.currentOperand = Math.log10(current).toString();
                this.addToHistory(`log(${current})`, this.currentOperand);
                this.updateDisplay();
                break;
            case 'ln':
                this.currentOperand = Math.log(current).toString();
                this.addToHistory(`ln(${current})`, this.currentOperand);
                this.updateDisplay();
                break;
            case 'pi':
                this.currentOperand = Math.PI.toString();
                this.updateDisplay();
                break;
            case 'e':
                this.currentOperand = Math.E.toString();
                this.updateDisplay();
                break;
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                computation = prev / current;
                break;
            case 'power':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }

        const operatorSymbol = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷',
            'power': '^'
        };

        this.addToHistory(
            `${prev} ${operatorSymbol[this.operation]} ${current}`,
            computation.toString()
        );

        this.currentOperand = computation.toString();
        this.operation = null;
        this.previousOperand = '';
        this.shouldResetScreen = true;
        this.updateDisplay();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = null;
        this.updateDisplay();
    }

    delete() {
        if (this.currentOperand === '0') return;
        this.currentOperand = this.currentOperand.slice(0, -1);
        if (this.currentOperand === '') this.currentOperand = '0';
        this.updateDisplay();
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    updateDisplay() {
        this.currentDisplay.textContent = this.formatNumber(this.currentOperand);
        
        if (this.operation != null) {
            const operatorSymbol = {
                'add': '+',
                'subtract': '−',
                'multiply': '×',
                'divide': '÷',
                'power': '^'
            };
            this.previousDisplay.textContent = 
                `${this.formatNumber(this.previousOperand)} ${operatorSymbol[this.operation]}`;
        } else {
            this.previousDisplay.textContent = '';
        }
    }

    formatNumber(number) {
        if (number === '') return '';
        const num = parseFloat(number);
        if (isNaN(num)) return number;
        
        // Handle very large or very small numbers
        if (Math.abs(num) > 999999999 || (Math.abs(num) < 0.000001 && num !== 0)) {
            return num.toExponential(6);
        }
        
        // Round to avoid floating point errors
        return parseFloat(num.toFixed(10)).toString();
    }

    addToHistory(expression, result) {
        const historyItem = {
            expression,
            result: this.formatNumber(result),
            timestamp: new Date().toISOString()
        };
        
        this.history.unshift(historyItem);
        if (this.history.length > 50) {
            this.history = this.history.slice(0, 50);
        }
        
        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        if (this.history.length === 0) {
            this.historyList.innerHTML = '<p class="history-empty">No calculations yet</p>';
            return;
        }

        this.historyList.innerHTML = '';
        this.history.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-expression">${item.expression}</div>
                <div class="history-result">= ${item.result}</div>
            `;
            
            historyItem.addEventListener('click', () => {
                this.currentOperand = item.result;
                this.updateDisplay();
            });
            
            this.historyList.appendChild(historyItem);
        });
    }

    clearHistory() {
        if (confirm('Clear all calculation history?')) {
            this.history = [];
            this.saveHistory();
            this.renderHistory();
            this.showNotification('History cleared', 'success');
        }
    }

    loadHistory() {
        try {
            const history = localStorage.getItem('calculatorHistory');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Error loading history:', error);
            return [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
        } catch (error) {
            console.error('Error saving history:', error);
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            background: type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: '9999',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideInRight 0.3s ease',
            fontSize: '0.95rem',
            fontWeight: '500'
        });

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// This is where you can add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// This is where you can add notification animations 
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
    console.log('🔢 Calculator initialized');
});
