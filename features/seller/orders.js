import { storage } from '../../shared/js/storage.js';
import { STORAGE_KEYS } from '../../shared/js/storage-keys.js';
import { seedUsers } from "../../shared/js/user-seed.js";
import { seedProducts } from "../../shared/js/products-seed.js";

// Initialize seed data
seedUsers();
seedProducts();

function checkAuth() {
    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

    if (!currentUser) {
        window.location.href = '../auth/login.html';
        return null;
    }

    if (currentUser.role !== 'seller') {
        Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You do not have permission to access this page.',
            confirmButtonColor: '#BB976D'
        }).then(() => {
            window.location.href = '../../index.html';
        });
        return null;
    }

    return currentUser;
}

const currentUser = checkAuth();
if (!currentUser) {
    throw new Error('Authentication required');
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

function getCustomerDisplayName(order) {
    const users = storage.get(STORAGE_KEYS.USERS) || [];
    const customer = users.find(user => user.id === order.userId);

    if (customer?.username) {
        return customer.username;
    }

    return order.customerName || order.customer || order.customerEmail || 'Customer';
}

function displayOrders(filter = 'all', searchTerm = '') {
    const tbody = document.getElementById('ordersTableBody');
    const products = getSellerProducts();
    let orders = getSellerOrders();

    if (filter !== 'all') {
        orders = orders.filter(order =>
            order.status && order.status.toLowerCase() === filter.toLowerCase()
        );
    }

    if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        orders = orders.filter(order =>
            String(order.id).includes(lower) ||
            getCustomerDisplayName(order).toLowerCase().includes(lower)
        );
    }

    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center py-4">
                    <i class="fas fa-inbox fa-3x text-muted mb-3 d-block"></i>
                    <p class="text-muted mb-0">No orders found</p>
                </td>
            </tr>
        `;
        return;
    }

    orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    tbody.innerHTML = orders.map(order => {
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

        const customerName = getCustomerDisplayName(order);
        const orderDate = new Date(order.createdAt).toLocaleDateString();
        const statusClass = getStatusClass(order.status);
        const currentStatus = order.status || 'pending';

        return `
            <tr>
                <td><strong>#${order.id}</strong></td>
                <td>${customerName}</td>
                <td>
                    <div>${product?.name || 'Product'}</div>
                    ${sellerItems.length > 1 ? `<small class="text-muted">+${sellerItems.length - 1} more items</small>` : ''}
                </td>
                <td>${totalQty}</td>
                <td><strong>$${totalPrice.toFixed(2)}</strong></td>
                <td>${orderDate}</td>
                <td><span class="badge ${statusClass}">${currentStatus}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewOrderDetails('${order.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).filter(html => html !== '').join('');
}

function getStatusClass(status) {
    switch (status?.toLowerCase()) {
        case 'received':
            return 'bg-success';
        case 'cancelled':
            return 'bg-danger';
        case 'pending':
        default:
            return 'bg-warning';
    }
}

window.viewOrderDetails = function (orderId) {
    orderId = Number(orderId);
    const allOrders = storage.get(STORAGE_KEYS.ORDERS) || [];
    const order = allOrders.find(o => o.id === orderId);
    const products = getSellerProducts();

    if (!order) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Order not found',
            confirmButtonColor: '#BB976D'
        });
        return;
    }

    const sellerItems = order.items.filter(item =>
        products.some(p => p.id === item.productId)
    );

    const customerName = getCustomerDisplayName(order);

    const itemsHTML = sellerItems.map(item => {
        const product = products.find(p => p.id === item.productId);
        return `
            <tr>
                <td>${product?.name || 'Product'}</td>
                <td>${item.quantity}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td><strong>$${(item.price * item.quantity).toFixed(2)}</strong></td>
            </tr>
        `;
    }).join('');

    const total = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    Swal.fire({
        title: `Order #${order.id}`,
        html: `
            <div class="text-start">
                <p><strong>Customer:</strong> ${customerName}</p>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Status:</strong> <span class="badge ${getStatusClass(order.status)}">${order.status || 'Pending'}</span></p>
                
                <h6 class="mt-3 mb-2">Items:</h6>
                <table class="table table-sm">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHTML}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" class="text-end"><strong>Total:</strong></td>
                            <td><strong>$${total.toFixed(2)}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        `,
        width: '600px',
        confirmButtonColor: '#BB976D'
    });
};

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

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            updateThemeIcon();
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            storage.remove(STORAGE_KEYS.CURRENT_USER);
            window.location.href = '../auth/login.html';
        });
    }

    applyTheme();
}

function applyTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (!themeToggleBtn) return;

    const icon = themeToggleBtn.querySelector('i');
    if (document.body.classList.contains('dark-theme')) {
        icon.className = 'fas fa-sun';
        localStorage.setItem('theme', 'dark');
    } else {
        icon.className = 'fas fa-moon';
        localStorage.setItem('theme', 'light');
    }
}

function initOrders() {
    displayOrders();

    const filterSelect = document.getElementById('statusFilter');
    const searchInput = document.getElementById('orderSearchInput');
    const clearBtn = document.getElementById('clearOrderFiltersBtn');

    function applyFilters() {
        displayOrders(
            filterSelect?.value || 'all',
            searchInput?.value.trim() || ''
        );
    }

    if (filterSelect) filterSelect.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            filterSelect.value = 'all';
            searchInput.value = '';
            displayOrders();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    initOrders();
});
