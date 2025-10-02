// Personal Expense Tracker with Authentication
class ExpenseTrackerApp {
    constructor() {
        // Sample users from provided data
        this.users = [
            {"id": 1, "fullName": "John Doe", "email": "john@example.com", "password": "password123"},
            {"id": 2, "fullName": "Jane Smith", "email": "jane@example.com", "password": "password456"}
        ];

        // Sample expenses organized by user ID from provided data
        this.userExpenses = {
            1: [
                {"id": 1, "description": "Grocery shopping", "amount": 85.50, "category": "Food & Dining", "date": "2025-09-01", "notes": "Weekly groceries"},
                {"id": 2, "description": "Gas", "amount": 45.00, "category": "Transportation", "date": "2025-09-02", "notes": ""},
                {"id": 3, "description": "Netflix subscription", "amount": 15.99, "category": "Entertainment", "date": "2025-09-01", "notes": "Monthly subscription"}
            ],
            2: [
                {"id": 1, "description": "Coffee", "amount": 4.50, "category": "Food & Dining", "date": "2025-09-03", "notes": "Morning coffee"},
                {"id": 2, "description": "Uber ride", "amount": 12.00, "category": "Transportation", "date": "2025-09-04", "notes": "To work"}
            ]
        };

        // Categories from provided data
        this.categories = ["Food & Dining", "Transportation", "Shopping", "Entertainment", "Bills & Utilities", "Healthcare", "Travel", "Education", "Other"];
        
        // Current session
        this.currentSession = {
            userId: null,
            userName: null,
            isLoggedIn: false
        };

        this.nextUserId = 3;
        this.currentEditId = null;
        this.currentDeleteId = null;
        this.charts = {};

        this.init();
    }

    init() {
        this.setupAuthEventListeners();
        this.setupExpenseEventListeners();
        this.checkSession();
    }

    checkSession() {
        // For demo purposes, show login form initially
        this.showAuthContainer();
    }

    showAuthContainer() {
        const authContainer = document.getElementById('auth-container');
        const mainApp = document.getElementById('main-app');
        
        if (authContainer) authContainer.classList.remove('hidden');
        if (mainApp) mainApp.classList.add('hidden');
    }

    showMainApp() {
        const authContainer = document.getElementById('auth-container');
        const mainApp = document.getElementById('main-app');
        
        if (authContainer) authContainer.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');

        // Initialize expense tracker after showing main app
        setTimeout(() => {
            this.initializeExpenseTracker();
        }, 100);
    }

    setupAuthEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form-element');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Register form
        const registerForm = document.getElementById('register-form-element');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }

        // Form switching
        const showRegisterBtn = document.getElementById('show-register');
        if (showRegisterBtn) {
            showRegisterBtn.addEventListener('click', () => this.showRegisterForm());
        }

        const showLoginBtn = document.getElementById('show-login');
        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', () => this.showLoginForm());
        }

        // Password strength
        const registerPassword = document.getElementById('register-password');
        if (registerPassword) {
            registerPassword.addEventListener('input', (e) => this.checkPasswordStrength(e.target.value));
        }

        // Logout
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    showLoginForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) loginForm.classList.remove('hidden');
        if (registerForm) registerForm.classList.add('hidden');
        
        this.clearErrors();
    }

    showRegisterForm() {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
        
        this.clearErrors();
    }

    handleLogin() {
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        // Clear previous errors
        this.clearErrors();

        // Basic validation
        if (!email || !password) {
            this.showError('login-error', 'Please fill in all fields');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('login-error', 'Please enter a valid email address');
            return;
        }

        // Check credentials
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) {
            this.showError('login-error', 'Invalid email or password');
            return;
        }

        // Login successful - set session
        this.currentSession = {
            userId: user.id,
            userName: user.fullName,
            isLoggedIn: true
        };

        // Update UI and show main app
        this.updateUserGreeting();
        this.showMainApp();
    }

    handleRegister() {
        const fullName = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const termsChecked = document.getElementById('terms-checkbox').checked;

        // Clear previous messages
        this.clearErrors();

        // Validation
        if (!fullName || !email || !password || !confirmPassword) {
            this.showError('register-error', 'Please fill in all fields');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showError('register-error', 'Please enter a valid email address');
            return;
        }

        if (password !== confirmPassword) {
            this.showError('register-error', 'Passwords do not match');
            return;
        }

        if (!this.isPasswordStrong(password)) {
            this.showError('register-error', 'Password must be at least 8 characters with uppercase, lowercase, and numbers');
            return;
        }

        if (!termsChecked) {
            this.showError('register-error', 'Please accept the terms and conditions');
            return;
        }

        // Check if email already exists
        const existingUser = this.users.find(u => u.email === email);
        if (existingUser) {
            this.showError('register-error', 'An account with this email already exists');
            return;
        }

        // Create new user
        const newUser = {
            id: this.nextUserId++,
            fullName,
            email,
            password
        };

        this.users.push(newUser);
        this.userExpenses[newUser.id] = []; // Initialize empty expenses for new user

        // Show success message
        this.showSuccess('register-success', 'Account created successfully! Please sign in.');
        
        // Clear form and switch to login
        document.getElementById('register-form-element').reset();
        setTimeout(() => this.showLoginForm(), 2000);
    }

    checkPasswordStrength(password) {
        const strengthFill = document.getElementById('strength-fill');
        const strengthText = document.getElementById('strength-text');
        
        if (!strengthFill || !strengthText) return;

        let strength = 0;
        let text = 'Very weak';
        let className = '';

        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        strengthFill.className = 'strength-fill';
        
        if (strength === 0 || password.length === 0) {
            text = 'Password strength';
            className = '';
        } else if (strength <= 2) {
            text = 'Weak';
            className = 'weak';
        } else if (strength === 3) {
            text = 'Fair';
            className = 'fair';
        } else if (strength === 4) {
            text = 'Good';
            className = 'good';
        } else if (strength === 5) {
            text = 'Strong';
            className = 'strong';
        }

        if (className) {
            strengthFill.classList.add(className);
        }
        strengthText.textContent = text;
    }

    isPasswordStrong(password) {
        return password.length >= 8 && 
               /[a-z]/.test(password) && 
               /[A-Z]/.test(password) && 
               /[0-9]/.test(password);
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }
    }

    showSuccess(elementId, message) {
        const successElement = document.getElementById(elementId);
        if (successElement) {
            successElement.textContent = message;
            successElement.classList.remove('hidden');
        }
    }

    clearErrors() {
        const errorElements = document.querySelectorAll('.auth-error, .auth-success');
        errorElements.forEach(el => {
            el.classList.add('hidden');
            el.textContent = '';
        });
    }

    updateUserGreeting() {
        const userNameSpan = document.getElementById('user-name');
        if (userNameSpan && this.currentSession.userName) {
            userNameSpan.textContent = this.currentSession.userName;
        }
    }

    logout() {
        this.currentSession = {
            userId: null,
            userName: null,
            isLoggedIn: false
        };

        // Clear forms
        const loginForm = document.getElementById('login-form-element');
        if (loginForm) loginForm.reset();
        
        this.clearErrors();
        this.showAuthContainer();
        this.showLoginForm();
    }

    // Initialize expense tracker functionality
    initializeExpenseTracker() {
        this.setDefaultDate();
        this.updateDashboard();
        this.renderTransactions();
        this.initializeCharts();
        this.generateSavingsTips();
    }

    // Get current user's expenses
    getCurrentUserExpenses() {
        if (!this.currentSession.userId) return [];
        return this.userExpenses[this.currentSession.userId] || [];
    }

    // Set current user's expenses
    setCurrentUserExpenses(expenses) {
        if (!this.currentSession.userId) return;
        this.userExpenses[this.currentSession.userId] = expenses;
    }

    getNextExpenseId() {
        const expenses = this.getCurrentUserExpenses();
        return expenses.length > 0 ? Math.max(...expenses.map(e => e.id)) + 1 : 1;
    }

    setupExpenseEventListeners() {
        // Tab navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav__tab')) {
                e.preventDefault();
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            }
        });

        // Quick add form
        const quickForm = document.getElementById('quick-add-form');
        if (quickForm) {
            quickForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addExpenseFromQuickForm();
            });
        }

        // Main expense form
        const expenseForm = document.getElementById('expense-form');
        if (expenseForm) {
            expenseForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addExpense();
            });
        }

        // Edit form
        const editForm = document.getElementById('edit-form');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateExpense();
            });
        }

        // Modal controls
        const closeModal = document.getElementById('close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeEditModal());
        }

        const cancelEdit = document.getElementById('cancel-edit');
        if (cancelEdit) {
            cancelEdit.addEventListener('click', () => this.closeEditModal());
        }

        const closeDeleteModal = document.getElementById('close-delete-modal');
        if (closeDeleteModal) {
            closeDeleteModal.addEventListener('click', () => this.closeDeleteModal());
        }

        const cancelDelete = document.getElementById('cancel-delete');
        if (cancelDelete) {
            cancelDelete.addEventListener('click', () => this.closeDeleteModal());
        }

        const confirmDelete = document.getElementById('confirm-delete');
        if (confirmDelete) {
            confirmDelete.addEventListener('click', () => this.deleteExpense());
        }

        // Cancel buttons
        const cancelExpense = document.getElementById('cancel-expense');
        if (cancelExpense) {
            cancelExpense.addEventListener('click', () => this.resetExpenseForm());
        }

        // Filters and search
        const searchInput = document.getElementById('search-transactions');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterTransactions());
        }

        const filterCategory = document.getElementById('filter-category');
        if (filterCategory) {
            filterCategory.addEventListener('change', () => this.filterTransactions());
        }

        const filterFrom = document.getElementById('filter-from');
        if (filterFrom) {
            filterFrom.addEventListener('change', () => this.filterTransactions());
        }

        const filterTo = document.getElementById('filter-to');
        if (filterTo) {
            filterTo.addEventListener('change', () => this.filterTransactions());
        }

        const clearFilters = document.getElementById('clear-filters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => this.clearFilters());
        }

        // Modal backdrop clicks
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
            backdrop.addEventListener('click', (e) => {
                if (e.target === backdrop) {
                    this.closeEditModal();
                    this.closeDeleteModal();
                }
            });
        });
    }

    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        const expenseDate = document.getElementById('expense-date');
        if (expenseDate) {
            expenseDate.value = today;
        }
    }

    switchTab(tabName) {
        // Update nav tabs
        document.querySelectorAll('.nav__tab').forEach(tab => {
            tab.classList.remove('nav__tab--active');
        });
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('nav__tab--active');
        }

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('tab-content--active');
        });
        const activeContent = document.getElementById(tabName);
        if (activeContent) {
            activeContent.classList.add('tab-content--active');
        }

        // Update charts if switching to analytics
        if (tabName === 'analytics') {
            setTimeout(() => this.updateCharts(), 100);
        }
    }

    addExpenseFromQuickForm() {
        if (!this.currentSession.isLoggedIn) return;

        const description = document.getElementById('quick-description').value.trim();
        const amount = parseFloat(document.getElementById('quick-amount').value);
        const category = document.getElementById('quick-category').value;

        if (!description || !amount || !category) {
            alert('Please fill in all required fields');
            return;
        }

        const expenses = this.getCurrentUserExpenses();
        const expense = {
            id: this.getNextExpenseId(),
            description,
            amount,
            category,
            date: new Date().toISOString().split('T')[0],
            notes: ''
        };

        expenses.unshift(expense);
        this.setCurrentUserExpenses(expenses);
        this.updateDashboard();
        this.renderTransactions();
        this.updateCharts();
        this.generateSavingsTips();

        // Reset form
        document.getElementById('quick-add-form').reset();
        this.showExpenseSuccess('Expense added successfully!');
    }

    addExpense() {
        if (!this.currentSession.isLoggedIn) return;

        const description = document.getElementById('expense-description').value.trim();
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const category = document.getElementById('expense-category').value;
        const date = document.getElementById('expense-date').value;
        const notes = document.getElementById('expense-notes').value.trim();

        if (!description || !amount || !category || !date) {
            alert('Please fill in all required fields');
            return;
        }

        const expenses = this.getCurrentUserExpenses();
        const expense = {
            id: this.getNextExpenseId(),
            description,
            amount,
            category,
            date,
            notes
        };

        expenses.unshift(expense);
        this.setCurrentUserExpenses(expenses);
        this.updateDashboard();
        this.renderTransactions();
        this.updateCharts();
        this.generateSavingsTips();

        this.resetExpenseForm();
        this.showExpenseSuccess('Expense added successfully!');
    }

    editExpense(id) {
        const expenses = this.getCurrentUserExpenses();
        const expense = expenses.find(e => e.id === id);
        if (!expense) return;

        this.currentEditId = id;
        
        // Populate edit form
        document.getElementById('edit-description').value = expense.description;
        document.getElementById('edit-amount').value = expense.amount;
        document.getElementById('edit-category').value = expense.category;
        document.getElementById('edit-date').value = expense.date;
        document.getElementById('edit-notes').value = expense.notes;

        // Show modal
        const modal = document.getElementById('edit-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    updateExpense() {
        if (!this.currentEditId) return;

        const description = document.getElementById('edit-description').value.trim();
        const amount = parseFloat(document.getElementById('edit-amount').value);
        const category = document.getElementById('edit-category').value;
        const date = document.getElementById('edit-date').value;
        const notes = document.getElementById('edit-notes').value.trim();

        if (!description || !amount || !category || !date) {
            alert('Please fill in all required fields');
            return;
        }

        const expenses = this.getCurrentUserExpenses();
        const expenseIndex = expenses.findIndex(e => e.id === this.currentEditId);
        if (expenseIndex === -1) return;

        expenses[expenseIndex] = {
            ...expenses[expenseIndex],
            description,
            amount,
            category,
            date,
            notes
        };

        this.setCurrentUserExpenses(expenses);
        this.updateDashboard();
        this.renderTransactions();
        this.updateCharts();
        this.generateSavingsTips();
        this.closeEditModal();
        this.showExpenseSuccess('Expense updated successfully!');
    }

    confirmDelete(id) {
        this.currentDeleteId = id;
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    deleteExpense() {
        if (!this.currentDeleteId) return;

        const expenses = this.getCurrentUserExpenses();
        const updatedExpenses = expenses.filter(e => e.id !== this.currentDeleteId);
        this.setCurrentUserExpenses(updatedExpenses);
        
        this.updateDashboard();
        this.renderTransactions();
        this.updateCharts();
        this.generateSavingsTips();
        this.closeDeleteModal();
        this.showExpenseSuccess('Expense deleted successfully!');
    }

    closeEditModal() {
        const modal = document.getElementById('edit-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.currentEditId = null;
    }

    closeDeleteModal() {
        const modal = document.getElementById('delete-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        this.currentDeleteId = null;
    }

    resetExpenseForm() {
        const form = document.getElementById('expense-form');
        if (form) {
            form.reset();
            this.setDefaultDate();
        }
    }

    showExpenseSuccess(message) {
        const successDiv = document.getElementById('success-message');
        if (successDiv) {
            const statusDiv = successDiv.querySelector('.status');
            if (statusDiv) {
                statusDiv.textContent = message;
            }
            successDiv.classList.remove('hidden');
            successDiv.classList.add('show');
            
            setTimeout(() => {
                successDiv.classList.add('hidden');
                successDiv.classList.remove('show');
            }, 3000);
        }
    }

    updateDashboard() {
        const expenses = this.getCurrentUserExpenses();
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const currentMonth = new Date().toISOString().substring(0, 7);
        const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
        const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        const daysInMonth = new Date().getDate();
        const dailyAverage = monthlyTotal / daysInMonth;

        // Get top category
        const categoryTotals = {};
        expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });
        const topCategory = Object.keys(categoryTotals).length > 0 ? 
            Object.keys(categoryTotals).reduce((a, b) => 
                categoryTotals[a] > categoryTotals[b] ? a : b) : 'None';

        const totalElement = document.getElementById('total-expenses');
        if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
        
        const monthElement = document.getElementById('month-expenses');
        if (monthElement) monthElement.textContent = `$${monthlyTotal.toFixed(2)}`;
        
        const avgElement = document.getElementById('daily-average');
        if (avgElement) avgElement.textContent = `$${dailyAverage.toFixed(2)}`;
        
        const topCatElement = document.getElementById('top-category');
        if (topCatElement) topCatElement.textContent = topCategory;
    }

    renderTransactions() {
        const tbody = document.getElementById('transactions-tbody');
        if (!tbody) return;

        const filteredExpenses = this.getFilteredExpenses();

        if (filteredExpenses.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <div>
                            <h3>No transactions found</h3>
                            <p>Add your first expense to get started</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = filteredExpenses.map(expense => `
            <tr>
                <td>${this.formatDate(expense.date)}</td>
                <td>${expense.description}</td>
                <td>${expense.category}</td>
                <td class="amount-positive">$${expense.amount.toFixed(2)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn btn--secondary btn-icon" onclick="window.app.editExpense(${expense.id})">Edit</button>
                        <button class="btn btn--outline btn-icon" onclick="window.app.confirmDelete(${expense.id})">Delete</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getFilteredExpenses() {
        let expenses = this.getCurrentUserExpenses();
        let filtered = [...expenses];

        // Search filter
        const searchInput = document.getElementById('search-transactions');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        if (searchTerm) {
            filtered = filtered.filter(expense => 
                expense.description.toLowerCase().includes(searchTerm) ||
                expense.category.toLowerCase().includes(searchTerm) ||
                expense.notes.toLowerCase().includes(searchTerm)
            );
        }

        // Category filter
        const categoryFilter = document.getElementById('filter-category');
        const categoryValue = categoryFilter ? categoryFilter.value : '';
        if (categoryValue) {
            filtered = filtered.filter(expense => expense.category === categoryValue);
        }

        // Date range filter
        const fromInput = document.getElementById('filter-from');
        const toInput = document.getElementById('filter-to');
        const fromDate = fromInput ? fromInput.value : '';
        const toDate = toInput ? toInput.value : '';
        
        if (fromDate) {
            filtered = filtered.filter(expense => expense.date >= fromDate);
        }
        if (toDate) {
            filtered = filtered.filter(expense => expense.date <= toDate);
        }

        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    filterTransactions() {
        this.renderTransactions();
    }

    clearFilters() {
        const searchInput = document.getElementById('search-transactions');
        if (searchInput) searchInput.value = '';
        
        const categoryFilter = document.getElementById('filter-category');
        if (categoryFilter) categoryFilter.value = '';
        
        const fromInput = document.getElementById('filter-from');
        if (fromInput) fromInput.value = '';
        
        const toInput = document.getElementById('filter-to');
        if (toInput) toInput.value = '';
        
        this.renderTransactions();
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    initializeCharts() {
        // Wait for DOM to be ready
        setTimeout(() => {
            this.createCategoryChart();
            this.createTrendChart();
            this.createMonthlyChart();
            this.updateStatistics();
        }, 200);
    }

    createCategoryChart() {
        const canvas = document.getElementById('category-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const expenses = this.getCurrentUserExpenses();
        
        // Calculate category totals
        const categoryTotals = {};
        expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454'];

        if (this.charts.category) {
            this.charts.category.destroy();
        }

        if (labels.length === 0) {
            // Show empty state
            return;
        }

        this.charts.category = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    createTrendChart() {
        const canvas = document.getElementById('trend-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const expenses = this.getCurrentUserExpenses();
        
        // Get current month's daily totals
        const currentMonth = new Date().toISOString().substring(0, 7);
        const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
        
        const dailyTotals = {};
        monthlyExpenses.forEach(expense => {
            const day = expense.date.split('-')[2];
            dailyTotals[day] = (dailyTotals[day] || 0) + expense.amount;
        });

        const daysInMonth = new Date().getDate();
        const labels = [];
        const data = [];
        
        for (let i = 1; i <= daysInMonth; i++) {
            const day = i.toString().padStart(2, '0');
            labels.push(day);
            data.push(dailyTotals[day] || 0);
        }

        if (this.charts.trend) {
            this.charts.trend.destroy();
        }

        this.charts.trend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Daily Spending',
                    data: data,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    createMonthlyChart() {
        const canvas = document.getElementById('monthly-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const expenses = this.getCurrentUserExpenses();
        
        // Get last 6 months of data
        const monthlyTotals = {};
        expenses.forEach(expense => {
            const month = expense.date.substring(0, 7);
            monthlyTotals[month] = (monthlyTotals[month] || 0) + expense.amount;
        });

        const sortedMonths = Object.keys(monthlyTotals).sort().slice(-6);
        const labels = sortedMonths.map(month => {
            return new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        });
        const data = sortedMonths.map(month => monthlyTotals[month]);

        if (this.charts.monthly) {
            this.charts.monthly.destroy();
        }

        this.charts.monthly = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Monthly Spending',
                    data: data,
                    backgroundColor: '#FFC185',
                    borderColor: '#DB4545',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    updateCharts() {
        this.createCategoryChart();
        this.createTrendChart();
        this.createMonthlyChart();
        this.updateStatistics();
    }

    updateStatistics() {
        const statsContainer = document.getElementById('statistics');
        if (!statsContainer) return;
        
        const expenses = this.getCurrentUserExpenses();
        
        if (expenses.length === 0) {
            statsContainer.innerHTML = '<div class="empty-state"><p>No data available for statistics</p></div>';
            return;
        }

        // Calculate statistics
        const sortedExpenses = [...expenses].sort((a, b) => b.amount - a.amount);
        const highestExpense = sortedExpenses[0];
        
        const dailyTotals = {};
        expenses.forEach(expense => {
            dailyTotals[expense.date] = (dailyTotals[expense.date] || 0) + expense.amount;
        });
        
        const highestSpendingDay = Object.keys(dailyTotals).reduce((a, b) => 
            dailyTotals[a] > dailyTotals[b] ? a : b, Object.keys(dailyTotals)[0]);
        
        const categoryTotals = {};
        expenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });
        
        const mostExpensiveCategory = Object.keys(categoryTotals).reduce((a, b) => 
            categoryTotals[a] > categoryTotals[b] ? a : b, 'None');

        const avgExpense = expenses.length > 0 ? 
            expenses.reduce((sum, expense) => sum + expense.amount, 0) / expenses.length : 0;

        statsContainer.innerHTML = `
            <div class="stat-item">
                <div class="stat-item__label">Highest Single Expense</div>
                <div class="stat-item__value">$${highestExpense ? highestExpense.amount.toFixed(2) : '0.00'}</div>
            </div>
            <div class="stat-item">
                <div class="stat-item__label">Highest Spending Day</div>
                <div class="stat-item__value">${this.formatDate(highestSpendingDay)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-item__label">Most Expensive Category</div>
                <div class="stat-item__value">${mostExpensiveCategory}</div>
            </div>
            <div class="stat-item">
                <div class="stat-item__label">Average Expense</div>
                <div class="stat-item__value">$${avgExpense.toFixed(2)}</div>
            </div>
        `;
    }

    generateSavingsTips() {
        const tipsContainer = document.getElementById('personalized-tips');
        if (!tipsContainer) return;
        
        const expenses = this.getCurrentUserExpenses();
        
        // Calculate category spending
        const categoryTotals = {};
        const currentMonth = new Date().toISOString().substring(0, 7);
        const monthlyExpenses = expenses.filter(e => e.date.startsWith(currentMonth));
        
        monthlyExpenses.forEach(expense => {
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        const tips = [];

        // Dining out tip
        const diningSpent = categoryTotals['Food & Dining'] || 0;
        if (diningSpent > 100) {
            const savings = (diningSpent * 0.3).toFixed(0);
            tips.push({
                title: 'Reduce Dining Out',
                message: `You spent $${diningSpent.toFixed(2)} on food & dining this month. Cooking at home 2-3 days could save you approximately $${savings}.`
            });
        }

        // Transportation tip
        const transportSpent = categoryTotals['Transportation'] || 0;
        if (transportSpent > 80) {
            tips.push({
                title: 'Transportation Savings',
                message: `Your transportation expenses are $${transportSpent.toFixed(2)} this month. Consider carpooling or public transport to reduce costs.`
            });
        }

        // Entertainment tip
        const entertainmentSpent = categoryTotals['Entertainment'] || 0;
        if (entertainmentSpent > 50) {
            tips.push({
                title: 'Entertainment Budget',
                message: `You've spent $${entertainmentSpent.toFixed(2)} on entertainment. Look for free activities like hiking, library events, or community programs.`
            });
        }

        // Subscription audit tip
        const subscriptionExpenses = expenses.filter(e => 
            e.description.toLowerCase().includes('subscription') || 
            e.description.toLowerCase().includes('netflix') ||
            e.description.toLowerCase().includes('spotify')
        );
        
        if (subscriptionExpenses.length > 0) {
            const subscriptionTotal = subscriptionExpenses.reduce((sum, e) => sum + e.amount, 0);
            tips.push({
                title: 'Review Subscriptions',
                message: `You have $${subscriptionTotal.toFixed(2)} in subscription services. Cancel unused subscriptions to save money.`
            });
        }

        // Default tip if no specific patterns found
        if (tips.length === 0) {
            tips.push({
                title: 'Keep Tracking!',
                message: 'Great job tracking your expenses! Continue monitoring your spending patterns to identify more savings opportunities.'
            });
        }

        tipsContainer.innerHTML = tips.map(tip => `
            <div class="personalized-tip">
                <h4>${tip.title}</h4>
                <p>${tip.message}</p>
            </div>
        `).join('');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ExpenseTrackerApp();
});