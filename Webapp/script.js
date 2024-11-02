// Budget and Expense Data
let budget = 0;
let expenses = [];

// Set Monthly Budget
function setBudget() {
    const budgetInput = document.getElementById("budget").value;
    budget = parseFloat(budgetInput);
    document.getElementById("budget").value = "";
    updateUI();
}

// Add Expense with Date
function addExpense() {
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (description && amount && category && date) {
        expenses.push({ description, amount, category, date });
        document.getElementById("description").value = "";
        document.getElementById("amount").value = "";
        document.getElementById("date").value = "";
        updateUI();
    } else {
        alert("Please fill all fields");
    }
}

// Update UI
function updateUI() {
    renderExpenses();
    renderCategoryChart();
    renderMonthlyTrendChart();
}

// Render Expenses List
function renderExpenses() {
    const expenseList = document.getElementById("expense-list");
    expenseList.innerHTML = expenses.map((expense, index) =>
        `<li class="expense-item">
            <span>${expense.description} - $${expense.amount} on ${expense.date}</span>
            <span>${expense.category}</span>
            <button onclick="deleteExpense(${index})">Delete</button>
        </li>`
    ).join("");
}

// Delete Expense
function deleteExpense(index) {
    expenses.splice(index, 1);
    updateUI();
}

// Render Category Chart
function renderCategoryChart() {
    const ctx = document.getElementById("categoryChart").getContext("2d");
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
    }, {});

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    if (window.categoryChart) window.categoryChart.destroy();

    window.categoryChart = new Chart(ctx, {
        type: "pie",
        data: {
            labels: categories,
            datasets: [{
                label: "Spending by Category",
                data: amounts,
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Render Monthly Expense Trend Chart
function renderMonthlyTrendChart() {
    const ctx = document.getElementById("monthlyTrendChart").getContext("2d");

    // Group expenses by date
    const dateTotals = expenses.reduce((acc, expense) => {
        const date = expense.date;
        acc[date] = (acc[date] || 0) + expense.amount;
        return acc;
    }, {});

    const sortedDates = Object.keys(dateTotals).sort();
    const sortedAmounts = sortedDates.map(date => dateTotals[date]);

    // Destroy previous chart instance if it exists
    if (window.monthlyTrendChart) window.monthlyTrendChart.destroy();

    window.monthlyTrendChart = new Chart(ctx, {
        type: "line",
        data: {
            labels: sortedDates,
            datasets: [{
                label: "Daily Expenses",
                data: sortedAmounts,
                borderColor: "#4BC0C0",
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: "Date" }
                },
                y: {
                    title: { display: true, text: "Amount ($)" },
                    beginAtZero: true
                }
            }
        }
    });
}
