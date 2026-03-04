import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { renderNavbar, updateCartBadge } from "../../shared/js/navbar.js";
import { renderFooter } from "../../shared/js/footer.js";

/* ---------------- Layout ---------------- */

renderNavbar();
renderFooter();
/* ---------------- Auth Protection ---------------- */

const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

if (!currentUser) {
  window.location.href = "../auth/login.html";
}

// Get all orders
const orders = storage.get(STORAGE_KEYS.ORDERS) || [];

// Filter orders by current user
const userOrders = orders.filter(o => o.userId === currentUser.id);

// Get the last order
const lastOrder = userOrders[userOrders.length - 1];

// Get the container in HTML where cards will render
const checkoutContainer = document.getElementById("checkoutContainer");
const totalEl = document.getElementById("checkoutTotal");

function renderCheckout() {
  if (!lastOrder) return; // No orders yet

  let total = 0;
  checkoutContainer.innerHTML = ""; // Clear container

  lastOrder.items.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const card = document.createElement("div");
    card.className = "col-md-4";

    card.innerHTML = `
      <div class="card h-100">
        <img src="${item.image}" class="card-img-top" style="height:200px; object-fit:cover;">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${item.name}</h5>
          <p class="card-text mb-1">Price: ${item.price} EGP</p>
          <p class="card-text mb-1">Quantity: ${item.quantity}</p>
          <p class="card-text mb-2">Total: ${itemTotal} EGP</p>
          <span class="badge bg-warning text-dark">${lastOrder.status}</span>
        </div>
      </div>
    `;

    checkoutContainer.appendChild(card);
  });

  totalEl.textContent = total;
}

// Render checkout on page load
renderCheckout();