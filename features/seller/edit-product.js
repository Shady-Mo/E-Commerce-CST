import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { Product } from "../../shared/js/Product.js";
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

function getProductById(productId) {
    const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
    return allProducts.find(p => p.id === productId && p.sellerId === currentUser.id);
}

function updateProduct(productId, updates) {
    const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
    const productIndex = allProducts.findIndex(p => p.id === productId && p.sellerId === currentUser.id);

    if (productIndex === -1) {
        return { success: false, errors: ["Product not found or unauthorized"] };
    }

    const existingProduct = allProducts[productIndex];
    const updatedProduct = new Product({
        ...existingProduct,
        ...updates,
        id: productId,
        sellerId: currentUser.id
    });

    updatedProduct.updateTimestamp();

    const validation = updatedProduct.validate();
    if (!validation.isValid) {
        return { success: false, errors: validation.errors };
    }

    allProducts[productIndex] = updatedProduct.toJSON();
    storage.set(STORAGE_KEYS.PRODUCTS, allProducts);

    return { success: true, product: updatedProduct.toJSON() };
}

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return parseInt(urlParams.get('id'));
}

function loadProductData() {
    const productId = getProductIdFromURL();

    if (!productId) {
        showToast('Invalid product ID', 'error');
        setTimeout(() => {
            window.location.href = 'manage-products.html';
        }, 1000);
        return;
    }

    const product = getProductById(productId);

    if (!product) {
        showToast('Product not found', 'error');
        setTimeout(() => {
            window.location.href = 'manage-products.html';
        }, 1000);
        return;
    }

    document.getElementById('productId').value = product.id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productCategory').value = product.category || '';
    document.getElementById('productPrice').value = product.price;
    document.getElementById('productOldPrice').value = product.oldPrice || '';
    document.getElementById('productStock').value = product.stock;
    document.getElementById('productDiscount').value = product.discount || 0;
    document.getElementById('productBadge').value = product.badge || '';
    document.getElementById('productDescription').value = product.description || '';

    if (product.image) {
        document.getElementById('imagePreview').src = product.image;
        document.getElementById('imagePreviewContainer').style.display = 'block';
    }

    const additionalPreview = document.getElementById('additionalImagesPreview');
    if (additionalPreview && product.images && product.images.length > 0) {
        additionalPreview.innerHTML = product.images.map(src =>
            `<img src="${src}" style="width:80px;height:80px;object-fit:cover;border-radius:6px;border:1px solid #dee2e6" alt="additional">`
        ).join('');
    }

}

async function handleUpdateProduct(e) {
    e.preventDefault();

    const productId = parseInt(document.getElementById('productId').value);
    const imageInput = document.getElementById('productImage');
    const imageFile = imageInput.files[0];

    const existingProduct = getProductById(productId);
    let imageData = existingProduct.image;

    if (imageFile) {
        try {
            imageData = await convertImageToBase64(imageFile);
        } catch (error) {
            showToast('Failed to process image', 'error');
            return;
        }
    }

    const additionalFiles = Array.from(document.getElementById('productImages').files).slice(0, 4);
    let additionalImages = existingProduct.images || [];
    if (additionalFiles.length > 0) {
        try {
            additionalImages = await Promise.all(additionalFiles.map(convertImageToBase64));
        } catch (error) {
            showToast('Failed to process additional images', 'error');
            return;
        }
    }

    const productData = {
        name: document.getElementById('productName').value.trim(),
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        oldPrice: parseFloat(document.getElementById('productOldPrice').value) || null,
        stock: parseInt(document.getElementById('productStock').value),
        discount: parseInt(document.getElementById('productDiscount').value) || 0,
        badge: document.getElementById('productBadge').value || null,
        image: imageData,
        description: document.getElementById('productDescription').value.trim(),
        images: additionalImages
    };

    const result = updateProduct(productId, productData);

    if (result.success) {
        showToast('Product updated successfully', 'success');
        setTimeout(() => {
            window.location.href = 'manage-products.html';
        }, 1000);
    } else {
        displayFormErrors(result.errors);
    }
}

function displayFormErrors(errors) {
    clearFormErrors();
    const errorAlert = document.getElementById('formErrorAlert');
    errorAlert.textContent = errors.join(', ');
    errorAlert.classList.remove('d-none');
}

function clearFormErrors() {
    document.getElementById('formErrorAlert').classList.add('d-none');
    document.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));
    document.querySelectorAll('.invalid-feedback').forEach(el => el.textContent = '');
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

const imageInput = document.getElementById('productImage');
if (imageInput) {
    imageInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (event) {
                document.getElementById('imagePreview').src = event.target.result;
                document.getElementById('imagePreviewContainer').style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

const additionalImagesInput = document.getElementById('productImages');
if (additionalImagesInput) {
    additionalImagesInput.addEventListener('change', function (e) {
        const preview = document.getElementById('additionalImagesPreview');
        preview.innerHTML = '';
        Array.from(e.target.files).slice(0, 4).forEach(file => {
            const reader = new FileReader();
            reader.onload = function (event) {
                const img = document.createElement('img');
                img.src = event.target.result;
                img.style.cssText = 'width:80px;height:80px;object-fit:cover;border-radius:6px;border:1px solid #dee2e6';
                preview.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });
}

const form = document.getElementById('productForm');
if (form) {
    form.addEventListener('submit', handleUpdateProduct);
}

loadProductData();

function initSidebar() {
    const sidebar = document.getElementById('sellerSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const toggleBtn = document.getElementById('sidebarToggle');
    const closeBtn = document.getElementById('sidebarClose');

    if (toggleBtn) toggleBtn.addEventListener('click', () => { sidebar.classList.add('active'); overlay.classList.add('active'); });
    if (closeBtn) closeBtn.addEventListener('click', () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); });
    if (overlay) overlay.addEventListener('click', () => { sidebar.classList.remove('active'); overlay.classList.remove('active'); });

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.body.classList.toggle('theme-dark', currentTheme === 'dark');
        document.documentElement.setAttribute('data-bs-theme', currentTheme);
        themeToggleBtn.querySelector('i').className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

        themeToggleBtn.addEventListener('click', () => {
            const theme = localStorage.getItem('theme') || 'light';
            const newTheme = theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            document.body.classList.toggle('theme-dark', newTheme === 'dark');
            document.documentElement.setAttribute('data-bs-theme', newTheme);
            themeToggleBtn.querySelector('i').className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => { storage.remove(STORAGE_KEYS.CURRENT_USER); window.location.href = '../../index.html'; });
}

document.addEventListener('DOMContentLoaded', () => { initSidebar(); });
