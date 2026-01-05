let transactions = [];

const form = document.getElementById('expense-form');
const nameInput = document.getElementById('name');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transaction-list');

const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');

let ctx = document.getElementById('expenseChart').getContext('2d');
let expenseChart;

form.addEventListener('submit', function(e){
    e.preventDefault();
    let name = nameInput.value;
    let amount = parseFloat(amountInput.value);
    let type = typeInput.value;

    if(name === '' || isNaN(amount)) return;

    let transaction = {id: Date.now(), name, amount, type};
    transactions.push(transaction);

    addTransactionDOM(transaction);
    updateBalance();
    updateChart();

    form.reset();
});

function addTransactionDOM(transaction){
    const li = document.createElement('li');
    li.id = transaction.id;

    li.innerHTML = `
        <span>${transaction.name} (${transaction.type}) - ₹${transaction.amount}</span>
        <span class="transaction-buttons">
            <button class="edit" onclick="editTransaction(${transaction.id})">Edit</button>
            <button class="delete" onclick="deleteTransaction(${transaction.id})">Delete</button>
        </span>
    `;

    transactionList.appendChild(li);
}

function updateBalance(){
    let income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount,0);
    let expense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount,0);
    let balance = income - expense;

    balanceEl.textContent = balance;
    incomeEl.textContent = income;
    expenseEl.textContent = expense;
}

function deleteTransaction(id){
    transactions = transactions.filter(t => t.id !== id);
    document.getElementById(id).remove();
    updateBalance();
    updateChart();
}

function editTransaction(id){
    let transaction = transactions.find(t => t.id === id);
    nameInput.value = transaction.name;
    amountInput.value = transaction.amount;
    typeInput.value = transaction.type;
    deleteTransaction(id);
}

// Chart.js Pie Chart
function updateChart(){
    let categories = {};
    transactions.forEach(t => {
        if(t.type === 'expense'){
            if(categories[t.name]) categories[t.name] += t.amount;
            else categories[t.name] = t.amount;
        }
    });

    let labels = Object.keys(categories);
    let data = Object.values(categories);

    if(expenseChart) expenseChart.destroy();

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expense Distribution',
                data: data,
                backgroundColor: [
                    '#ff4757','#ffa502','#1e90ff','#2ed573','#e84393','#ff7f50','#3742fa'
                ]
            }]
        }
    });
}
