import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { renderNavbar } from "../../shared/js/navbar.js";
import { renderFooter } from "../../shared/js/footer.js";
import { updateCartBadge } from "../../shared/js/navbar.js";
/* ------------------ Render Layout ------------------ */

renderNavbar();
renderFooter();

/* ------------------ Auth Protection ------------------ */

const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

if (!currentUser || currentUser.role !== "customer") {
  window.location.href = "../../features/auth/login.html";
}

/* ------------------ Setup ------------------ */

const container = document.getElementById("productsContainer");
const products = storage.get(STORAGE_KEYS.PRODUCTS);

// Cart key per user
const cartKey = `cart_${currentUser.id}`;

/* ------------------ Render Products ------------------ */

function renderProducts() {
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

  container.addEventListener("click", function (e) {

    if (!e.target.classList.contains("add-to-cart")) return;

    const productId = parseInt(e.target.dataset.id);

    let cart = storage.get(cartKey);


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
    showToast();
  });
}

/* ------------------ Toast Notification ------------------ */

function showToast() {

  const toastHTML = `
    <div class="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3">
      <div class="d-flex">
        <div class="toast-body">
          Product added to cart successfully ✔
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

  const toast = new bootstrap.Toast(
    wrapper.querySelector(".toast")
  );

  toast.show();

  setTimeout(() => wrapper.remove(), 3000);
}

/* ------------------ Initialize ------------------ */

renderProducts();
initAddToCart();