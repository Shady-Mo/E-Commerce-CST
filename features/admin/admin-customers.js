import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";

function normalizeStatus(status) {
    return (status || 'Pending').toLowerCase().trim();
}

function formatStatusLabel(status) {
    const normalizedStatus = normalizeStatus(status);
    return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
}

function getStatusBadge(status) {
    const normalizedStatus = normalizeStatus(status);
    const statusLabel = formatStatusLabel(status);

    if (['received', 'delivered', 'completed'].includes(normalizedStatus)) {
        return `<span class="badge bg-success"><i class="fas fa-check-circle me-1"></i>${statusLabel}</span>`;
    }

    if (['processing', 'shipped'].includes(normalizedStatus)) {
        return `<span class="badge bg-info"><i class="fas fa-truck-fast me-1"></i>${statusLabel}</span>`;
    }

    if (normalizedStatus === 'cancelled') {
        return `<span class="badge bg-danger"><i class="fas fa-times-circle me-1"></i>${statusLabel}</span>`;
    }

    return `<span class="badge bg-warning text-dark"><i class="fas fa-clock me-1"></i>${statusLabel}</span>`;
}

function getUserById(userId) {
    const users = storage.get(STORAGE_KEYS.USERS) || [];
    return users.find(u => u.id === userId);
}


export function renderCustomerService() {
    const container = document.getElementById('csListContainer');
    if (!container) return;

    const orders = storage.get(STORAGE_KEYS.ORDERS) || [];
    if (orders.length === 0) {
        container.innerHTML = '<div class="text-center py-5"><i class="fas fa-inbox fa-3x text-muted mb-3"></i><p class="text-muted">No orders at this time.</p></div>';
        return;
    }

    let html = '<div class="list-group cs-order-list">';
    orders.forEach(o => {
        const user = getUserById(o.userId);
        const customerName = user ? user.username : (o.customerEmail || o.customer || 'N/A');
        const customerEmail = user ? user.email : '';
        const status = normalizeStatus(o.status);
        const itemCount = o.items ? o.items.length : 0;
        const total = (o.items || []).reduce((s, i) => s + (i.price * i.quantity), 0);

        html += `<div class="list-group-item cs-order-item">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h6 class="mb-1 fw-bold">Order #${o.id}</h6>
                    <small class="text-muted"><i class="fas fa-calendar-alt me-1"></i>${o.date || new Date(o.createdAt || Date.now()).toLocaleDateString()}</small>
                </div>
                <div>${getStatusBadge(o.status)}</div>
            </div>
            <div class="mb-2">
                <span class="me-3"><i class="fas fa-user me-1"></i>${customerName}</span>
                ${customerEmail ? `<span class="text-muted"><i class="fas fa-envelope me-1"></i>${customerEmail}</span>` : ''}
            </div>
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <span class="me-3"><i class="fas fa-box me-1"></i>${itemCount} item${itemCount !== 1 ? 's' : ''}</span>
                    <span class="fw-bold" style="color: var(--main-color);"><i class="fas fa-coins me-1"></i>${total.toLocaleString()} EGP</span>
                </div>
                <div class="btn-group btn-group-sm">
                    ${status === 'pending' ? `<button class="btn btn-success change-status" data-order-id="${o.id}" data-new-status="Received"><i class="fas fa-check me-1"></i>Received</button>` : ''}
                    ${status === 'pending' ? `<button class="btn btn-outline-danger change-status" data-order-id="${o.id}" data-new-status="Cancelled"><i class="fas fa-times me-1"></i>Cancel</button>` : ''}
                </div>
            </div>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll('.change-status').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target.closest('.change-status');
            const id = Number(target.getAttribute('data-order-id'));
            const newStatus = target.getAttribute('data-new-status');

            const colorMap = { Received: '#198754', Cancelled: '#dc3545' };
            const iconMap = { Received: 'question', Cancelled: 'warning' };

            Swal.fire({
                title: `Mark as ${newStatus}?`,
                text: `Change Order #${id} status to "${newStatus}".`,
                icon: iconMap[newStatus] || 'question',
                showCancelButton: true,
                confirmButtonColor: colorMap[newStatus] || '#BB976D',
                cancelButtonColor: '#6c757d',
                confirmButtonText: `Yes, ${newStatus}`,
                cancelButtonText: 'Cancel',
                background: (localStorage.getItem('theme') === 'dark') ? '#1e1e1e' : '#fff',
                color: (localStorage.getItem('theme') === 'dark') ? '#eee' : '#333',
            }).then((result) => {
                if (result.isConfirmed) {
                    const all = storage.get(STORAGE_KEYS.ORDERS);
                    const idx = all.findIndex(x => x.id === id);
                    if (idx === -1) return;
                    all[idx].status = newStatus;
                    storage.set(STORAGE_KEYS.ORDERS, all);
                    renderCustomerService();

                    Swal.fire({
                        title: 'Updated!',
                        text: `Order #${id} has been marked as ${newStatus}.`,
                        icon: 'success',
                        confirmButtonColor: '#BB976D',
                        timer: 1800,
                        showConfirmButton: false,
                        background: (localStorage.getItem('theme') === 'dark') ? '#1e1e1e' : '#fff',
                        color: (localStorage.getItem('theme') === 'dark') ? '#eee' : '#333',
                    });
                }
            });
        });
    });
}
