const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const transactionList = document.getElementById("transaction-list");
const form = document.getElementById("transaction-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");

// Load from localStorage or empty array
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Add transaction
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const description = descriptionInput.value;
    const amount = +amountInput.value;

    const transaction = {
        id: Date.now(),
        description,
        amount
    };

    transactions.push(transaction);
    saveTransactions();
    renderTransactions();

    descriptionInput.value = "";
    amountInput.value = "";
});

// Delete transaction
function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
    renderTransactions();
}

// Save to localStorage
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Render transactions
function renderTransactions() {
    transactionList.innerHTML = "";
    let income = 0, expense = 0;

    transactions.forEach(t => {
        const li = document.createElement("li");
        li.classList.add(t.amount > 0 ? "income" : "expense");
        li.innerHTML = `
      ${t.description} <span>₦${t.amount}</span>
      <button class="delete-btn" onclick="deleteTransaction(${t.id})">X</button>
    `;
        transactionList.appendChild(li);

        if (t.amount > 0) {
            income += t.amount;
        } else {
            expense += Math.abs(t.amount);
        }
    });

    const balance = income - expense;

    balanceEl.innerText = balance;
    incomeEl.innerText = income;
    expenseEl.innerText = expense;
}

// Initial render
renderTransactions();

const categoryInput = document.getElementById("category");

// The following block is redundant and causes a redeclaration error, so it has been removed.
// If you need to add category and date to transactions, do so in the form submit handler.

function renderChart() {
    const categories = {};
    transactions.forEach(t => {
        if (t.amount < 0) { // only expenses
            categories[t.category] = (categories[t.category] || 0) + Math.abs(t.amount);
        }
    });

    const ctx = document.getElementById('categoryChart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#9C27B0']
            }]
        }
    });
}

const transaction = {
    id: Date.now(),
    description,
    amount,
    category: categoryInput.value,
    date: document.getElementById("date").value
};
// Removed duplicate declaration of 'transaction' to fix redeclaration error.

function applyFilter() {
    const filterMonth = document.getElementById("filter-month").value;
    if (!filterMonth) return renderTransactions();

    const filtered = transactions.filter(t => t.date.startsWith(filterMonth));
    renderTransactions(filtered);
}

// Modify renderTransactions to accept optional data
function renderTransactions(data = transactions) {
    transactionList.innerHTML = "";
    let income = 0, expense = 0;

    data.forEach(t => {
        const li = document.createElement("li");
        li.classList.add(t.amount > 0 ? "income" : "expense");
        li.innerHTML = `
      ${t.description} <span>₦${t.amount}</span>
      <button class="delete-btn" onclick="deleteTransaction(${t.id})">X</button>
    `;
        transactionList.appendChild(li);

        if (t.amount > 0) {
            income += t.amount;
        } else {
            expense += Math.abs(t.amount);
        }
    });

    const balance = income - expense;

    balanceEl.innerText = balance;
    incomeEl.innerText = income;
    expenseEl.innerText = expense;
}

function exportCSV() {
    let csv = "Description,Amount,Category,Date\n";
    transactions.forEach(t => {
        csv += `${t.description},${t.amount},${t.category},${t.date}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "expenses.csv";
    a.click();
}

function login() {
    const username = document.getElementById("username").value;
    localStorage.setItem("currentUser", username);
    transactions = JSON.parse(localStorage.getItem(username + "_transactions")) || [];
    renderTransactions();
}

function saveTransactions() {
    const user = localStorage.getItem("currentUser");
    localStorage.setItem(user + "_transactions", JSON.stringify(transactions));
}

function toggleInstructions() {
  const box = document.getElementById("instructions");
  box.style.display = (box.style.display === "none") ? "block" : "none";
}



