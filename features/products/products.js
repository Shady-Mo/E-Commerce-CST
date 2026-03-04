import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { renderNavbar, updateCartBadge } from "../../shared/js/navbar.js";
import { renderFooter } from "../../shared/js/footer.js";
import { seedProducts } from "../../shared/js/products-seed.js";

/* ------------------ Render Layout ------------------ */

renderNavbar();
renderFooter();
seedProducts();

/* ------------------ Setup ------------------ */

const container = document.getElementById("productsContainer");
const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
const products = allProducts.filter(p => p.approved !== false);

/* ------------------ Render Products ------------------ */

function renderProducts() {

  if (!container) return;

  container.innerHTML = "";

  products.forEach(product => {
    container.innerHTML += `
      <div class="col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm">
          <img src="${product.image}" 
               class="card-img-top" 
               style="height:200px;object-fit:cover;">
               
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text text-muted small">
              ${product.description ?? ""}
            </p>
            <h6 class="text-primary fw-bold mb-3">
              ${product.price} EGP
            </h6>

            <button 
              class="btn btn-dark mt-auto add-to-cart"
              data-id="${product.id}">
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

/* ------------------ Add To Cart ------------------ */

function initAddToCart() {

  if (!container) return;

  container.addEventListener("click", function (e) {

    if (!e.target.classList.contains("add-to-cart")) return;

    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

    /* ❌ Not Logged In */
    if (!currentUser || !currentUser.id) {

      showToast("You must login first to add items to cart.", "warning");

      // بعد 1.5 ثانية يروح للوجين
      setTimeout(() => {
        window.location.href = "../../features/auth/login.html";
      }, 1500);

      return;
    }

    /* ✅ Logged In */

    const cartKey = `cart_${currentUser.id}`;
    let cart = storage.get(cartKey) || [];

    const productId = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    storage.set(cartKey, cart);
    updateCartBadge();
    showToast("Product added to cart successfully ✔", "success");
  });
}

/* ------------------ Toast Function ------------------ */

function showToast(message, type = "success") {

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

/* ------------------ Initialize ------------------ */

renderProducts();
initAddToCart();
updateCartBadge();