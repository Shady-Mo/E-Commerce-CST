import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { renderNavbar, updateCartBadge, updateWishListBadge } from "../../shared/js/navbar.js";
import { renderFooter } from "../../shared/js/footer.js";
import { seedProducts } from "../../shared/js/products-seed.js";

/* ------------------ Render Layout ------------------ */

renderNavbar();
renderFooter();
seedProducts();

/* ------------------ Hero Swiper ------------------ */

function initHeroSwiper() {
  const heroSwiper = new Swiper(".heroSwiper", {
    loop: true,
    speed: 1000,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      // ✅ scoped (prevents conflict with other swipers)
      el: ".heroSwiper .swiper-pagination",
      clickable: true
    },
    on: {
      init() {
        animateText();
      },
      slideChangeTransitionStart() {
        document.querySelectorAll(".hero-subtitle, .hero-title, .hero-btn")
          .forEach(el => {
            el.classList.remove("animate__fadeInUp");
            el.style.opacity = "0";
          });
      },
      slideChangeTransitionEnd() {
        setTimeout(() => {
          animateText();
        }, 300);
      }
    }
  });

  function animateText() {
    const activeSlide = document.querySelector(".heroSwiper .swiper-slide-active");
    if (!activeSlide) return;

    activeSlide.querySelectorAll(".hero-subtitle, .hero-title, .hero-btn")
      .forEach((el, index) => {
        setTimeout(() => {
          el.style.opacity = "1";
          el.classList.add("animate__fadeInUp");
        }, index * 200);
      });
  }

  return heroSwiper;
}

/* ------------------ Setup Products Swiper ------------------ */

const productsContainer = document.getElementById("productsSwiperContainer");
const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
const products = allProducts.filter(p => p.approved !== false).slice(0, 8);

/* ------------------ Render Products for Swiper ------------------ */

function renderProducts() {
  if (!productsContainer) return;

  const swiperWrapper = productsContainer.querySelector(".swiper-wrapper");
  if (!swiperWrapper) return;

  swiperWrapper.innerHTML = "";

  products.forEach(product => {
    const hasOldPrice = product.oldPrice && product.oldPrice > product.price;
    const discount = hasOldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

    swiperWrapper.innerHTML += `
      <div class="swiper-slide">
        <div class="product-card h-100">
          <div class="product-image-wrapper">
            <img src="${product.image}"
                 class="product-image"
                 alt="${product.name}">

            <div class="product-badges">
              ${product.badge ? `<span class="badge-new">${product.badge}</span>` : ""}
              ${discount > 0 ? `<span class="badge-discount">-${discount}%</span>` : ""}
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
            <p class="product-description">${product.description ?? ""}</p>

            <div class="product-price">
              ${hasOldPrice ? `<span class="old-price">$${Number(product.oldPrice).toFixed(2)}</span>` : ""}
              <span class="current-price">$${Number(product.price).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

/* ------------------ Initialize Products Swiper ------------------ */

function initProductsSwiper() {
  if (typeof Swiper === "undefined") {
    console.error("Swiper not loaded");
    return;
  }

  if (!productsContainer) {
    console.error("Products container not found");
    return;
  }

  const productsSwiper = new Swiper("#productsSwiperContainer", {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },

    // ✅ navigation buttons on header (like design)
    navigation: {
      nextEl: ".products-next",
      prevEl: ".products-prev",
    },

    breakpoints: {
      576: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 3, spaceBetween: 30 },
      992: { slidesPerView: 4, spaceBetween: 30 },
    },

    speed: 800,
  });

  return productsSwiper;
}

/* ------------------ Add To Cart ------------------ */

function initAddToCart() {
  if (!productsContainer) return;

  productsContainer.addEventListener("click", function (e) {
    const addToCartBtn = e.target.closest(".add-to-cart");
    if (!addToCartBtn) return;

    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

    if (!currentUser || !currentUser.id) {
      showToast("You must login first to add items to cart.", "warning");
      setTimeout(() => {
        window.location.href = "../../features/auth/login.html";
      }, 1500);
      return;
    }

    const cartKey = `cart_${currentUser.id}`;
    const cart = storage.get(cartKey) || [];

   const productId = parseInt(addToCartBtn.dataset.id);
const product = products.find(p => p.id === productId);

if (!product) return;

/* ⭐ CHECK STOCK */
if (product.stock <= 0) {

  showToast("This product is out of stock ❌", "warning");

  return;
}

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

/* ⭐ decrease stock */
product.stock -= 1;

storage.set(STORAGE_KEYS.PRODUCTS, allProducts);
storage.set(cartKey, cart);

updateCartBadge();
showToast("Product added to cart successfully ✔", "success");
  });
}

/* ------------------ Add To WishList ------------------ */

function initAddToWishList() {
  if (!productsContainer) return;

  productsContainer.addEventListener("click", function (e) {
    const wishlistBtn = e.target.closest(".add-to-wishList");
    if (!wishlistBtn) return;

    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

    if (!currentUser || !currentUser.id) {
      showToast("You must login first to add items to WishList.", "warning");
      setTimeout(() => {
        window.location.href = "../../features/auth/login.html";
      }, 1500);
      return;
    }

    const wishKey = `wishlist_${currentUser.id}`;
    const wishList = storage.get(wishKey) || [];

    const productId = parseInt(wishlistBtn.dataset.id, 10);
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const exists = wishList.some(item => item.productId === productId);

    if (!exists) {
      wishList.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }

    storage.set(wishKey, wishList);
    updateWishListBadge();
    showToast("Product added to WishList ✔", "success");
  });
}

/* ------------------ Toast Function ------------------ */

function showToast(message, type = "success") {
  const toastHTML = `
    <div class="toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3 z-3">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;

  const wrapper = document.createElement("div");
  wrapper.innerHTML = toastHTML;
  document.body.appendChild(wrapper);

  const toastEl = wrapper.querySelector(".toast");
  const toast = new bootstrap.Toast(toastEl);
  toast.show();

  setTimeout(() => wrapper.remove(), 3000);
}

/* ------------------ Initialize ------------------ */

document.addEventListener("DOMContentLoaded", () => {
  initHeroSwiper();

  renderProducts();
  setTimeout(() => initProductsSwiper(), 50);

  initAddToCart();
  initAddToWishList();

  updateCartBadge();
  updateWishListBadge();
});