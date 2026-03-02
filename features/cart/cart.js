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
let cart = storage.get(cartKey);

const cartBody = document.getElementById("cartBody");
const grandTotalEl = document.getElementById("grandTotal");

let productToDelete = null;

/* ---------------- Render Cart ---------------- */

function renderCart() {

  cartBody.innerHTML = "";

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <tr>
        <td colspan="5" class="text-center py-4">
          Your cart is empty 🛒
        </td>
      </tr>
    `;
    grandTotalEl.textContent = 0;
    return;
  }

  let grandTotal = 0;

  cart.forEach(item => {

    const itemTotal = item.price * item.quantity;
    grandTotal += itemTotal;

    cartBody.innerHTML += `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-3">
            <img src="${item.image}" width="80" height="80" style="object-fit:cover;">
            <div class="fw-semibold">${item.name}</div>
          </div>
        </td>

        <td>${item.price} EGP</td>

        <td>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary decrease" data-id="${item.productId}">-</button>
            <span>${item.quantity}</span>
            <button class="btn btn-sm btn-outline-secondary increase" data-id="${item.productId}">+</button>
          </div>
        </td>

        <td>${itemTotal} EGP</td>

        <td>
          <button class="btn btn-sm btn-outline-danger remove" data-id="${item.productId}">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </td>
      </tr>
    `;
  });

  grandTotalEl.textContent = grandTotal;
}

/* ---------------- Events ---------------- */

cartBody.addEventListener("click", function (e) {

  const productId = parseInt(e.target.dataset.id);

  if (!productId) return;

  const item = cart.find(p => p.productId === productId);

  if (e.target.classList.contains("increase")) {
    item.quantity += 1;
  }

  if (e.target.classList.contains("decrease")) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    }
  }

  if (e.target.classList.contains("remove") ||
      e.target.closest(".remove")) {

    productToDelete = productId;

    const modal = new bootstrap.Modal(
      document.getElementById("deleteModal")
    );

    modal.show();

    return;
  }

  storage.set(cartKey, cart);
  renderCart();
  updateCartBadge();
});

/* ---------------- Confirm Delete ---------------- */

document.getElementById("confirmDelete")
  .addEventListener("click", function () {

    if (!productToDelete) return;

    cart = cart.filter(p => p.productId !== productToDelete);

    storage.set(cartKey, cart);

    renderCart();
    updateCartBadge();

    productToDelete = null;

    const modalEl = document.getElementById("deleteModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
});

/* ---------------- Init ---------------- */

renderCart();
updateCartBadge();