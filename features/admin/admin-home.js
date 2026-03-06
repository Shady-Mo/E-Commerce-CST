import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";

/* ============================================================
   Dashboard Home — Stats & Charts
   ============================================================ */

export function renderDashboardHome() {
    const orders   = storage.get(STORAGE_KEYS.ORDERS)   || [];
    const users    = storage.get(STORAGE_KEYS.USERS)     || [];
    const products = storage.get(STORAGE_KEYS.PRODUCTS)  || [];

    /* ---------- Stat cards ---------- */
    const totalRevenue = orders
        .filter(o => (o.status || '').toLowerCase() === 'received')
        .reduce((sum, o) => {
            return sum + (o.items || []).reduce((s, i) => s + (i.price * i.quantity), 0);
        }, 0);

    setText('statTotalOrders',   orders.length);
    setText('statTotalRevenue',  totalRevenue.toLocaleString('en-EG'));
    setText('statTotalUsers',    users.length);
    setText('statTotalProducts', products.length);

    /* ---------- Sales Rate Line Chart ---------- */
    const receivedOrders = orders.filter(o => (o.status || '').toLowerCase() === 'received');
    const salesByDate = buildSalesByDate(receivedOrders);
    const sortedDates = Object.keys(salesByDate).sort((a, b) => salesByDate[a].timestamp - salesByDate[b].timestamp);
    const salesValues = sortedDates.map(d => salesByDate[d].total);

    const isDark = (localStorage.getItem('theme') || 'light') === 'dark';
    const gridColor   = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';
    const textColor   = isDark ? '#aaa' : '#666';

    const salesCtx = document.getElementById('salesChart');
    if (salesCtx && typeof Chart !== 'undefined') {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: sortedDates,
                datasets: [{
                    label: 'Sales (EGP)',
                    data: salesValues,
                    borderColor: '#BB976D',
                    backgroundColor: 'rgba(187,151,109,0.15)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#BB976D',
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    borderWidth: 2.5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#2c2b2b',
                        titleColor: '#fff',
                        bodyColor: '#ddd',
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: ctx => `${ctx.parsed.y.toLocaleString()} EGP`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: gridColor },
                        ticks: { color: textColor, maxRotation: 45 }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: gridColor },
                        ticks: {
                            color: textColor,
                            callback: v => v.toLocaleString()
                        }
                    }
                }
            }
        });
    }

    /* ---------- Order Status Doughnut ---------- */
    const statusCounts = {};
    orders.forEach(o => {
        const s = (o.status || 'Pending').toLowerCase();
        statusCounts[s] = (statusCounts[s] || 0) + 1;
    });
    const statusLabels = Object.keys(statusCounts).map(s => s.charAt(0).toUpperCase() + s.slice(1));
    const statusData   = Object.values(statusCounts);
    const statusColors = statusLabels.map(s => {
        const l = s.toLowerCase();
        if (l === 'received')  return '#198754';
        if (l === 'pending')   return '#BB976D';
        if (l === 'cancelled') return '#dc3545';
        return '#6c757d';
    });

    const statusCtx = document.getElementById('statusChart');
    if (statusCtx && typeof Chart !== 'undefined') {
        new Chart(statusCtx, {
            type: 'doughnut',
            data: {
                labels: statusLabels,
                datasets: [{
                    data: statusData,
                    backgroundColor: statusColors,
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: textColor, padding: 16, usePointStyle: true, pointStyle: 'circle' }
                    }
                }
            }
        });
    }

    /* ---------- Top Selling Products Bar Chart ---------- */
    const productSales = {};
    orders.filter(o => (o.status || '').toLowerCase() === 'received').forEach(o => {
        (o.items || []).forEach(i => {
            const name = i.name || `Product #${i.productId}`;
            productSales[name] = (productSales[name] || 0) + (i.price * i.quantity);
        });
    });
    const sorted = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const topNames  = sorted.map(e => e[0]);
    const topValues = sorted.map(e => e[1]);

    const topCtx = document.getElementById('topProductsChart');
    if (topCtx && typeof Chart !== 'undefined') {
        new Chart(topCtx, {
            type: 'bar',
            data: {
                labels: topNames,
                datasets: [{
                    label: 'Revenue (EGP)',
                    data: topValues,
                    backgroundColor: 'rgba(187,151,109,0.7)',
                    borderColor: '#BB976D',
                    borderWidth: 1,
                    borderRadius: 6,
                    maxBarThickness: 44
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#2c2b2b',
                        callbacks: {
                            label: ctx => `${ctx.parsed.x.toLocaleString()} EGP`
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: { color: gridColor },
                        ticks: { color: textColor, callback: v => v.toLocaleString() }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: textColor, font: { size: 12 } }
                    }
                }
            }
        });
    }

    /* ---------- Recent Orders List ---------- */
    const container = document.getElementById('recentOrdersList');
    if (container) {
        const recent = [...orders].sort((a, b) => b.id - a.id).slice(0, 8);
        if (recent.length === 0) {
            container.innerHTML = '<p class="text-muted p-4 mb-0">No orders yet.</p>';
        } else {
            container.innerHTML = recent.map(o => {
                const total = (o.items || []).reduce((s, i) => s + i.price * i.quantity, 0);
                const status = (o.status || 'Pending').toLowerCase();
                const statusClass = status === 'received' ? 'bg-success' : status === 'cancelled' ? 'bg-danger' : 'bg-warning text-dark';
                const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
                return `
                    <div class="recent-order-item">
                        <div class="order-info">
                            <span class="order-id">Order #${o.id}</span>
                            <span class="order-date">${o.date || '—'}</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <span class="badge ${statusClass}" style="font-size:0.72rem;">${statusLabel}</span>
                            <span class="order-amount">${total.toLocaleString()} EGP</span>
                        </div>
                    </div>`;
            }).join('');
        }
    }
}

/* ---------- Helpers ---------- */

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function buildSalesByDate(orders) {
    const map = {};
    orders.forEach(o => {
        let dateKey;
        let timestamp;
        if (o.date) {
            const d = new Date(o.date);
            if (!isNaN(d.getTime())) {
                dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                timestamp = d.getTime();
            } else {
                dateKey = o.date.split(',')[0] || o.date;
                timestamp = 0;
            }
        } else {
            const d = new Date(o.id);
            dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            timestamp = d.getTime();
        }
        const total = (o.items || []).reduce((s, i) => s + i.price * i.quantity, 0);
        if (!map[dateKey]) {
            map[dateKey] = { total: 0, timestamp };
        }
        map[dateKey].total += total;
    });
    return map;
}
