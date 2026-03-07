import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { storage } from "../../shared/js/storage.js";

(function enforceSellerAccess() {
    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);
    if (!currentUser || currentUser.role !== "seller") {
        window.location.href = "../auth/login.html";
    }
})();

const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

function initSidebar() {
    const sidebar = document.getElementById('sellerSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const toggleBtn = document.getElementById('sidebarToggle');
    const closeBtn = document.getElementById('sidebarClose');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }

    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        const currentTheme = localStorage.getItem('theme') || 'light';
        applyTheme(currentTheme);
        updateThemeIcon(currentTheme);

        themeToggleBtn.addEventListener('click', () => {
            const theme = localStorage.getItem('theme') || 'light';
            const newTheme = theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
            updateThemeIcon(newTheme);
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            storage.remove(STORAGE_KEYS.CURRENT_USER);
            window.location.href = "../../index.html";
        });
    }
}

function applyTheme(theme) {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-bs-theme', 'light');
    }
}

function updateThemeIcon(theme) {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        const icon = themeToggleBtn.querySelector('i');
        if (icon) {
            icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

function initDashboard() {
    displaySellerName();
    calculateStatistics();
    initializeCharts();
}

function displaySellerName() {
    const sellerNameEl = document.getElementById('sellerName');
    if (sellerNameEl) {
        sellerNameEl.textContent = currentUser.username || currentUser.email;
    }
}

function getSellerProducts() {
    const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
    return allProducts.filter(p => p.sellerId === currentUser.id);
}

function getSellerOrders() {
    const allOrders = storage.get(STORAGE_KEYS.ORDERS) || [];
    const sellerProducts = getSellerProducts();
    const sellerProductIds = sellerProducts.map(p => p.id);

    return allOrders.filter(order =>
        order.items && order.items.some(item => sellerProductIds.includes(item.productId))
    );
}

const products = getSellerProducts();
function calculateStatistics() {
    const orders = getSellerOrders();

    document.getElementById('totalProducts').textContent = products.length;

    document.getElementById('totalOrders').textContent = orders.length;

    const totalSales = orders.reduce((sum, order) => {
        const sellerItems = order.items.filter(item =>
            products.some(p => p.id === item.productId)
        );
        const orderTotal = sellerItems.reduce((itemSum, item) =>
            itemSum + (item.price * item.quantity), 0
        );
        return sum + orderTotal;
    }, 0);
    document.getElementById('totalSales').textContent = `$${totalSales.toFixed(2)}`;

    const lowStockCount = products.filter(p => p.stock <= 5 && p.stock > 0).length;
    document.getElementById('lowStock').textContent = lowStockCount;
}

function initializeCharts() {
    initSalesChart();
    initProductStatusChart();
}

function initSalesChart() {
    const ctx = document.getElementById('salesChart');
    if (!ctx) return;

    const labels = [];
    const data = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        data.push(Math.floor(Math.random() * 1000) + 100);
    }

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Daily Sales ($)',
                data: data,
                borderColor: '#BB976D',
                backgroundColor: 'rgba(187, 151, 109, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function (value) {
                            return '$' + value;
                        }
                    }
                }
            }
        }
    });
}

function initProductStatusChart() {
    const ctx = document.getElementById('productStatusChart');
    if (!ctx) return;

    const products = getSellerProducts();
    const inStock = products.filter(p => p.stock > 5).length;
    const lowStock = products.filter(p => p.stock <= 5 && p.stock > 0).length;
    const outOfStock = products.filter(p => p.stock === 0).length;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['In Stock', 'Low Stock', 'Out of Stock'],
            datasets: [{
                data: [inStock, lowStock, outOfStock],
                backgroundColor: [
                    '#28a745',
                    '#ffc107',
                    '#dc3545'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initDashboard();
});
