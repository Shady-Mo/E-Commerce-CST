import { Product } from "../../shared/js/Product.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { storage } from "../../shared/js/storage.js";
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

function createProduct(productData) {
    const product = new Product({
        ...productData,
        sellerId: currentUser.id
    });

    const validation = product.validate();
    if (!validation.isValid) {
        return { success: false, errors: validation.errors };
    }

    const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
    allProducts.push(product.toJSON());
    storage.set(STORAGE_KEYS.PRODUCTS, allProducts);

    return { success: true, product: product.toJSON() };
}

function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function handleSaveProduct(e) {
    e.preventDefault();

    const imageInput = document.getElementById('productImage');
    const imageFile = imageInput.files[0];

    if (!imageFile) {
        displayFormErrors(['Product image is required']);
        return;
    }

    let imageData;
    try {
        imageData = await convertImageToBase64(imageFile);
    } catch (error) {
        showToast('Failed to process image', 'error');
        return;
    }

    const productData = {
        name: document.getElementById('productName').value.trim(),
        price: parseFloat(document.getElementById('productPrice').value),
        oldPrice: parseFloat(document.getElementById('productOldPrice').value) || null,
        stock: parseInt(document.getElementById('productStock').value),
        discount: parseInt(document.getElementById('productDiscount').value) || 0,
        badge: document.getElementById('productBadge').value || null,
        image: imageData,
        description: document.getElementById('productDescription').value.trim(),
        images: []
    };

    const result = createProduct(productData);

    if (result.success) {
        showToast('Product added successfully', 'success');
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

const form = document.getElementById('productForm');
if (form) {
    form.addEventListener('submit', handleSaveProduct);
}
