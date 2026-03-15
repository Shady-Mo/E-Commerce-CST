import { storage } from "../../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../../shared/js/storage-keys.js";
import { renderNavbar, updateCartBadge } from "../../../shared/js/navbar.js";
import { renderFooter } from "../../../shared/js/footer.js";

/* ---------------- Layout ---------------- */

renderNavbar();
renderFooter();
updateCartBadge();

const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

if (!currentUser) {
  window.location.href = "../../auth/login.html";
}

const orders = storage.get(STORAGE_KEYS.ORDERS) || [];
const myOrders = orders.filter(o => o.userId === currentUser.id);
const container = document.getElementById("ordersContainer");

/* ---------------- Helpers ---------------- */

function getStatusClass(status) {
  const normalized = (status || "").toLowerCase().trim();

  switch (normalized) {
    case "pending":
      return "status-pending";

    case "received":
      return "status-received";

    case "cancelled":
    case "canceled":
      return "status-cancelled";

    case "processing":
      return "status-processing";

    case "shipped":
      return "status-shipped";

    case "delivered":
      return "status-delivered";

    default:
      return "status-default";
  }
}

function formatStatus(status) {
  if (!status) return "Pending";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

/* ---------------- Empty State ---------------- */

if (myOrders.length === 0) {
  container.innerHTML = `
    <div class="col-12 text-center py-5 empty-orders">
      <img 
        src="../../../assets/images/Empty.gif" 
        alt="No orders" 
        class="img-fluid mb-3 no-orders-img "
      >

      <h4>No orders yet</h4>

      <p class="text-muted">Start shopping and place your first order</p>

      <a href="../../products/products-list.html" class="btn order-btn">
        Shop Now
      </a>
    </div>
  `;
}

/* ---------------- Render Orders ---------------- */

myOrders.forEach(order => {
  let itemsHTML = "";

  order.items.forEach(item => {
    itemsHTML += `
      <div class="order-product">
        <span>${item.name} x ${item.quantity}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
  });

  const statusClass = getStatusClass(order.status);

  container.innerHTML += `
    <div class="col-md-6">
      <div class="order-card">
        <div class="order-header">
          <div>
            <strong>Order #${order.id}</strong>
            <br>
            <small class="text-muted">
              ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
            </small>
          </div>

          <span class="order-status ${statusClass}">
            ${formatStatus(order.status)}
          </span>
        </div>

        ${itemsHTML}

        <div class="order-total">
          Total: $${Number(order.total).toFixed(2)}
        </div>
      </div>
    </div>
  `;
});