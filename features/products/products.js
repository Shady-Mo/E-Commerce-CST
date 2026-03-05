import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { renderNavbar, updateCartBadge, updateWishListBadge  } from "../../shared/js/navbar.js";
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
    const hasOldPrice = product.oldPrice && product.oldPrice > product.price;
    const discount = hasOldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
    
    container.innerHTML += `
      <div class="col-md-4 col-lg-3 mb-4">
        <div class="product-card h-100">
          <div class="product-image-wrapper">
            <img src="${product.image}" 
                 class="product-image" 
                 alt="${product.name}">
            
            <div class="product-badges">
              ${product.badge ? `<span class="badge-new">${product.badge}</span>` : ''}
              ${discount > 0 ? `<span class="badge-discount">-${discount}%</span>` : ''}
            </div>

            <div class="product-actions">
              <button class="action-btn add-to-cart" data-id="${product.id}" title="Add to Cart">
                <i class="fas fa-shopping-cart"></i>
              </button>
              <button class="action-btn add-to-wishList" data-id="${product.id}" title="Add to Wishlist">
                <i class="far fa-heart"></i>
              </button>
            </div>
          </div>
          
          <div class="product-info">
            <h5 class="product-title">${product.name}</h5>
            <p class="product-description">
              ${product.description ?? ""}
            </p>
            
            <div class="product-price">
              ${hasOldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
              <span class="current-price">$${product.price.toFixed(2)}</span>
            </div>
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

    const addToCartBtn = e.target.closest(".add-to-cart");
    if (!addToCartBtn) return;

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

    const productId = parseInt(addToCartBtn.dataset.id);
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

/* ------------------ Add To WishList ------------------ */
function initAddToWishList() {

  if (!container) return;

  container.addEventListener("click", function (e) {

    const wishlistBtn = e.target.closest(".add-to-wishList");
    if (!wishlistBtn) return;

    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

    /* ❌ Not Logged In */
    if (!currentUser || !currentUser.id) {

      showToast("You must login first to add items to WishList.", "warning");

      setTimeout(() => {
        window.location.href = "../../features/auth/login.html";
      }, 1500);

      return;
    }

    /* ✅ Logged In */
    const wishKey = `wishlist_${currentUser.id}`;
    let wishList = storage.get(wishKey) || [];

    const productId = parseInt(wishlistBtn.dataset.id);
    const product = products.find(p => p.id === productId);

    if (!product) return;

    const existingItem = wishList.find(item => item.productId === productId);

    if (!existingItem) {
      wishList.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }

    // Update storage and badge
    storage.set(wishKey, wishList);
    updateWishListBadge();
    showToast("Product added to WishList ✔", "success");
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
initAddToWishList();
updateCartBadge();
updateWishListBadge();