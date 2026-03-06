import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { storage } from "../../shared/js/storage.js";

(function enforceSellerAccess() {
    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);
    if (!currentUser || currentUser.role !== "seller") {
        window.location.href = "../auth/login.html";
    }
})();

const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

function initDashboard() {
    displaySellerName();
    calculateStatistics();
    initializeCharts();
    displayRecentOrders();
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

function calculateStatistics() {
    const products = getSellerProducts();
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

function displayRecentOrders() {
    const tbody = document.getElementById('ordersTableBody');
    if (!tbody) return;

    const orders = getSellerOrders();
    const products = getSellerProducts();

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5">
                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No orders yet</p>
                </td>
            </tr>
        `;
        return;
    }

    const recentOrders = orders.slice(-10).reverse();

    tbody.innerHTML = recentOrders.map(order => {
        const sellerItems = order.items.filter(item =>
            products.some(p => p.id === item.productId)
        );

        if (sellerItems.length === 0) return '';

        const firstItem = sellerItems[0];
        const product = products.find(p => p.id === firstItem.productId);
        const totalQty = sellerItems.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = sellerItems.reduce((sum, item) =>
            sum + (item.price * item.quantity), 0
        );

        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const statusClass = getStatusClass(order.status);

        return `
            <tr>
                <td>#${order.id}</td>
                <td>${order.customerName || 'Customer'}</td>
                <td>${product?.name || 'Product'}${sellerItems.length > 1 ? ` +${sellerItems.length - 1} more` : ''}</td>
                <td>${totalQty}</td>
                <td>$${totalPrice.toFixed(2)}</td>
                <td>${orderDate}</td>
                <td><span class="badge ${statusClass}">${order.status || 'Pending'}</span></td>
            </tr>
        `;
    }).join('');
}

function getStatusClass(status) {
    switch (status?.toLowerCase()) {
        case 'delivered':
        case 'completed':
            return 'bg-success';
        case 'processing':
        case 'shipped':
            return 'bg-info';
        case 'cancelled':
            return 'bg-danger';
        default:
            return 'bg-warning';
    }
}

document.addEventListener('DOMContentLoaded', initDashboard);
