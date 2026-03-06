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

/* ---------------- Setup ---------------- */

const cartKey = `cart_${currentUser.id}`;
let cart = storage.get(cartKey) || [];

const cartBody = document.getElementById("cartBody");
const grandTotalEl = document.getElementById("grandTotal");

let productToDelete = null;

/* ---------------- Toast ---------------- */

function showToast(message, type = "warning") {

  const toastHTML = `
    <div class="toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" 
                class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast">
        </button>
      </div>
    </div>
  `;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = toastHTML;
  document.body.appendChild(wrapper);

  const toastEl = wrapper.querySelector(".toast");
  const toast = new bootstrap.Toast(toastEl);

  toast.show();

  setTimeout(() => {
    wrapper.remove();
  }, 3000);
}

/* ---------------- Render Cart ---------------- */

function renderCart() {

  cartBody.innerHTML = "";

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4">
          Your cart is empty 🛒
        </td>
      </tr>
    `;

    document.getElementById("subTotal").textContent = "0 EGP";
    document.getElementById("shippingCost").textContent = "0 EGP";
    grandTotalEl.textContent = 0;

    return;
  }

  let subTotal = 0;

  cart.forEach(item => {

    const itemTotal = item.price * item.quantity;
    subTotal += itemTotal;

    cartBody.innerHTML += `
      <tr>

        <td>
          <div class="cart-img-box">
            <img src="${item.image}" class="cart-img" alt="${item.name}">
          </div>
        </td>

        <td>
          <div class="cart-name">${item.name}</div>
        </td>

        <td>${Number(item.price).toFixed(2)} EGP</td>

        <td>
          <div class="qty-box">
            <button class="qty-btn decrease" data-id="${item.productId}">-</button>
            <div class="qty-value">${item.quantity}</div>
            <button class="qty-btn increase" data-id="${item.productId}">+</button>
          </div>
        </td>

        <td>${Number(itemTotal).toFixed(2)} EGP</td>

        <td>
          <button class="remove-btn remove" data-id="${item.productId}">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>

      </tr>
    `;
  });

  const shipping = 0;
  const grandTotal = subTotal + shipping;

  document.getElementById("subTotal").textContent = `${grandTotal.toFixed(2)} EGP`;
  document.getElementById("shippingCost").textContent = `${shipping.toFixed(2)} EGP`;
  grandTotalEl.textContent = grandTotal.toFixed(2);
}

/* ---------------- Events ---------------- */

cartBody.addEventListener("click", function (e) {

  const incBtn = e.target.closest(".increase");
  const decBtn = e.target.closest(".decrease");
  const removeBtn = e.target.closest(".remove");

  /* ---------------- Remove ---------------- */

  if (removeBtn) {

    productToDelete = parseInt(removeBtn.dataset.id);

    const modalEl = document.getElementById("deleteModal");
    const modal = new bootstrap.Modal(modalEl);

    modal.show();
    return;
  }

  /* ---------------- Increase / Decrease ---------------- */

  const btn = incBtn || decBtn;
  if (!btn) return;

  const productId = parseInt(btn.dataset.id);
  const item = cart.find(p => p.productId === productId);
  if (!item) return;

  const products = storage.get(STORAGE_KEYS.PRODUCTS) || [];
  const product = products.find(p => p.id === productId);

  if (!product) return;

  /* Increase */

  if (incBtn) {

    if (product.stock <= 0) {

      showToast("No more stock available ❌", "warning");
      return;
    }

    item.quantity += 1;
    product.stock -= 1;
  }

  /* Decrease */

  if (decBtn && item.quantity > 1) {

    item.quantity -= 1;
    product.stock += 1;
  }

  storage.set(STORAGE_KEYS.PRODUCTS, products);
  storage.set(cartKey, cart);

  renderCart();
  updateCartBadge();
});

/* ---------------- Confirm Delete ---------------- */

document.getElementById("confirmDelete")
.addEventListener("click", function () {

  if (!productToDelete) return;

  const item = cart.find(p => p.productId === productToDelete);

  const products = storage.get(STORAGE_KEYS.PRODUCTS) || [];
  const product = products.find(p => p.id === productToDelete);

  if (product && item) {
    product.stock += item.quantity;
  }

  cart = cart.filter(p => p.productId !== productToDelete);

  storage.set(STORAGE_KEYS.PRODUCTS, products);
  storage.set(cartKey, cart);

  renderCart();
  updateCartBadge();

  productToDelete = null;

  const modalEl = document.getElementById("deleteModal");
  const modal = bootstrap.Modal.getInstance(modalEl);

  modal.hide();
});

/* ---------------- Checkout ---------------- */

const checkoutBtn = document.getElementById("checkoutBtn");

checkoutBtn.addEventListener("click", function () {

  if (cart.length === 0) return;

  const orders = storage.get(STORAGE_KEYS.ORDERS) || [];

  const newOrder = {
    id: Date.now(),
    userId: currentUser.id,
    items: cart,
    status: "Pending",
    date: new Date().toLocaleString()
  };

  orders.push(newOrder);
  storage.set(STORAGE_KEYS.ORDERS, orders);

  storage.remove(cartKey);

  window.location.href = "checkout.html";
});

/* ---------------- Init ---------------- */

renderCart();
updateCartBadge();