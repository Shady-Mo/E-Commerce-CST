import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { seedUsers } from "../../shared/js/user-seed.js";
import { seedProducts } from "../../shared/js/products-seed.js";

// Initialize seed data
seedUsers();
seedProducts();

(function enforceSellerAccess() {
    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);
    if (!currentUser || currentUser.role !== "seller") {
        window.location.href = "../auth/login.html";
    }
})();

const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

function getSellerProducts() {
    const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
    return allProducts.filter(p => p.sellerId === currentUser.id);
}

function deleteProduct(productId) {
    const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
    const productIndex = allProducts.findIndex(p => p.id === productId && p.sellerId === currentUser.id);

    if (productIndex === -1) {
        return { success: false, errors: ["Product not found or unauthorized"] };
    }

    allProducts.splice(productIndex, 1);
    storage.set(STORAGE_KEYS.PRODUCTS, allProducts);

    return { success: true };
}

function renderProductsTable() {
    const tbody = document.getElementById("productsTableBody");
    if (!tbody) return;

    const products = getSellerProducts();

    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5">
                    <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                    <p class="text-muted">No products yet. Click "Add New Product" to get started.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = products.map(product => {
        const createdDate = new Date(product.createdAt).toLocaleDateString();
        return `
        <tr>
            <td>
                <img src="${product.image}" alt="${product.name}" class="product-thumbnail">
            </td>
            <td>
                <div class="fw-semibold">${product.name}</div>
                ${product.badge ? `<span class="badge bg-secondary">${product.badge}</span>` : ''}
            </td>
            <td>
                <div class="fw-bold">$${product.price.toFixed(2)}</div>
                ${product.oldPrice ? `<small class="text-muted text-decoration-line-through">$${product.oldPrice.toFixed(2)}</small>` : ''}
            </td>
            <td>
                <span class="badge ${getStockClass(product.stock)}">
                    ${product.stock}
                </span>
            </td>
            <td>${createdDate}</td>
            <td>
                <a href="edit-product.html?id=${product.id}" class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-edit"></i>
                </a>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${product.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
    }).join('');

    attachEventListeners();
}

function getStockClass(stock) {
    if (stock === 0) return 'bg-danger';
    if (stock <= 5) return 'bg-warning';
    return 'bg-success';
}

function attachEventListeners() {
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = parseInt(e.currentTarget.dataset.id);
            handleDeleteProduct(productId);
        });
    });
}

function handleDeleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    const result = deleteProduct(productId);
    if (result.success) {
        renderProductsTable();
        showToast('Product deleted successfully', 'success');
    } else {
        showToast('Failed to delete product', 'error');
    }
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : 'danger'} position-fixed top-0 end-0 m-3`;
    toast.style.zIndex = '9999';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

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

document.addEventListener('DOMContentLoaded', () => {
    initSidebar();
    renderProductsTable();
});

