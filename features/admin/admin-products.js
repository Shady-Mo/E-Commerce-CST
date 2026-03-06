import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { showConfirm } from "./admin.js";


let productFilter = '';
let productPage = 1;
let productPageSize = 10;


export function renderProducts() {
    const container = document.getElementById('productsListContainer');
    if (!container) return;

    const products = storage.get(STORAGE_KEYS.PRODUCTS) || [];
    if (products.length === 0) {
        container.innerHTML = '<p class="text-muted">No products available.</p>';
        return;
    }

    let normalized = products.map(p => {
        if (typeof p.approved === 'undefined') p.approved = true;
        return p;
    });
    storage.set(STORAGE_KEYS.PRODUCTS, normalized);

    const filtered = normalized.filter(p =>
        p.name.toLowerCase().includes(productFilter) ||
        String(p.id).includes(productFilter) ||
        String(p.price).includes(productFilter)
    );

    if (filtered.length === 0) {
        container.innerHTML = '<p class="text-muted">No products match your search.</p>';
        return;
    }

    const totalPages = Math.max(1, Math.ceil(filtered.length / productPageSize));
    if (productPage > totalPages) productPage = totalPages;
    const startIndex = (productPage - 1) * productPageSize;
    const pageProducts = filtered.slice(startIndex, startIndex + productPageSize);

    let html = `
        <div class="table-responsive">
        <table class="table table-sm table-hover text-center">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Approved</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    pageProducts.forEach(p => {
        html += `
            <tr data-product-id="${p.id}">
                <td>${p.id}</td>
                <td>${p.name}</td>
                <td>${p.price}</td>
                <td>${p.approved ? 'Yes' : 'No'}</td>
                <td>
                    <div class="btn-group btn-group-sm" role="group">
                        <button class="btn btn-${p.approved ? 'warning' : 'success'} toggle-approve">${p.approved ? 'Unapprove' : 'Approve'}</button>
                        <button class="btn btn-outline-danger delete-product">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table></div>`;

    if (totalPages > 1) {
        html += '<nav><ul class="pagination justify-content-center mt-3">';
        for (let p = 1; p <= totalPages; p++) {
            html += `<li class="page-item ${p === productPage ? 'active' : ''}"><a class="page-link product-page-link" href="#" data-page="${p}">${p}</a></li>`;
        }
        html += '</ul></nav>';
    }

    container.innerHTML = html;

    container.querySelectorAll('.product-page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const p = Number(e.target.getAttribute('data-page'));
            if (!isNaN(p)) {
                productPage = p;
                renderProducts();
            }
        });
    });

    container.querySelectorAll('.toggle-approve').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tr = e.target.closest('tr');
            const id = Number(tr.getAttribute('data-product-id'));
            const all = storage.get(STORAGE_KEYS.PRODUCTS);
            const idx = all.findIndex(x => x.id === id);
            if (idx === -1) return;
            all[idx].approved = !all[idx].approved;
            storage.set(STORAGE_KEYS.PRODUCTS, all);
            renderProducts();
        });
    });

    container.querySelectorAll('.delete-product').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tr = e.target.closest('tr');
            const id = Number(tr.getAttribute('data-product-id'));
            showConfirm('Delete this product?', () => {
                let all = storage.get(STORAGE_KEYS.PRODUCTS);
                all = all.filter(x => x.id !== id);
                storage.set(STORAGE_KEYS.PRODUCTS, all);
                renderProducts();
            });
        });
    });
}


export function initProductSearch() {
    const productSearchEl = document.getElementById('productSearch');
    const productSizeEl = document.getElementById('productPageSize');

    if (productSearchEl) {
        productSearchEl.addEventListener('input', e => {
            productFilter = e.target.value.toLowerCase();
            productPage = 1;
            renderProducts();
        });
    }
    if (productSizeEl) {
        productSizeEl.addEventListener('change', e => {
            productPageSize = Number(e.target.value) || 10;
            productPage = 1;
            renderProducts();
        });
    }
}
