import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { renderNavbar } from "../../shared/js/navbar.js";
import { renderFooter } from "../../shared/js/footer.js";

renderNavbar();
renderFooter();
const container = document.getElementById("productsContainer");
const products = storage.get(STORAGE_KEYS.PRODUCTS);

function renderProducts() {
  container.innerHTML = "";

  products.forEach(product => {
    container.innerHTML += `
      <div class="col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm">
          <img src="${product.image}" class="card-img-top" style="height:200px;object-fit:cover;">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.name}</h5>
            <p class="card-text text-muted small">${product.description}</p>
            <h6 class="text-primary fw-bold mb-3">${product.price} EGP</h6>
            <button class="btn btn-dark mt-auto add-to-cart" data-id="${product.id}">
              Add To Cart
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

function initAddToCart() {
  container.addEventListener("click", function (e) {
    if (e.target.classList.contains("add-to-cart")) {
      const productId = parseInt(e.target.dataset.id);
      let cart = storage.get(STORAGE_KEYS.CART);

      const product = products.find(p => p.id === productId);
      const existing = cart.find(item => item.productId === productId);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        });
      }

      storage.set(STORAGE_KEYS.CART, cart);

      showToast();
    }
  });
}

function showToast() {
  const toastHTML = `
    <div class="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          Product added to cart successfully!
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = toastHTML;
  document.body.appendChild(wrapper);

  const toast = new bootstrap.Toast(wrapper.querySelector(".toast"));
  toast.show();

  setTimeout(() => wrapper.remove(), 3000);
}

renderProducts();
initAddToCart();