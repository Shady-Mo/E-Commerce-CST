import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { renderNavbar, updateCartBadge, updateWishListBadge } from "../../shared/js/navbar.js";
import { renderFooter } from "../../shared/js/footer.js";
import { seedProducts } from "../../shared/js/products-seed.js";

/* ---------------- Layout ---------------- */

renderNavbar();
renderFooter();
seedProducts();

/* ---------------- Setup ---------------- */

const container = document.getElementById("productsContainer");

const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
const products = allProducts.filter(p => p.approved !== false);

/* ---------------- Filters / Pagination عناصر ---------------- */

const searchByNameInput = document.getElementById("searchByName");
const filterCategorySelect = document.getElementById("filterCategory");
const sortPriceSelect = document.getElementById("sortPrice");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const paginationEl = document.getElementById("pagination");
const productsCountEl = document.getElementById("productsCount");

const PRODUCTS_PER_PAGE = 8;
let currentPage = 1;
let filteredProducts = [...products].reverse();

/* =========================================================
   AUTH CHECK
========================================================= */

function requireLogin(message = "You must login first.") {
  const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

  if (!currentUser || !currentUser.id) {
    showToast(message, "warning");

    setTimeout(() => {
      window.location.href = "../../features/auth/login.html";
    }, 1500);

    return null;
  }

  return currentUser;
}

/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

function addProductToCart(productId, qty = 1) {
  const currentUser = requireLogin("You must login first to add items to cart.");
  if (!currentUser) return;

  const cartKey = `cart_${currentUser.id}`;
  let cart = storage.get(cartKey) || [];

  const product = products.find(p => p.id === productId);
  if (!product) return;

  if (!product.stock || product.stock <= 0) {
    showToast("This product is out of stock ❌", "warning");
    return;
  }

  if (product.stock < qty) {
    showToast("Not enough stock ❌", "warning");
    return;
  }

  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty
    });
  }

  product.stock -= qty;

  storage.set(STORAGE_KEYS.PRODUCTS, allProducts);
  storage.set(cartKey, cart);

  updateCartBadge();
  renderProducts();
  renderPagination();
  updateProductsCount();
  renderProductDetails();

  showToast("Product added to cart ✔", "success");
}

function addProductToWishlist(productId) {
  const currentUser = requireLogin("You must login first to add items to wishlist.");
  if (!currentUser) return;

  const wishKey = `wishlist_${currentUser.id}`;
  let wishList = storage.get(wishKey) || [];

  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existing = wishList.find(item => item.productId === productId);

  if (existing) {
    showToast("Already in wishlist", "info");
    return;
  }

  wishList.push({
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.image
  });

  storage.set(wishKey, wishList);

  updateWishListBadge();
  showToast("Product added to wishlist ✔", "success");
}

/* =========================================================
   FILTERS / SORT / PAGINATION
========================================================= */

function populateCategories() {
  if (!filterCategorySelect) return;

  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  filterCategorySelect.innerHTML = `<option value="">All Categories</option>`;

  categories.forEach(category => {
    filterCategorySelect.innerHTML += `
      <option value="${category}">${category}</option>
    `;
  });
}

function applyFilters() {
  const searchName = searchByNameInput?.value.trim().toLowerCase() || "";
  const selectedCategory = filterCategorySelect?.value || "";
  const sortPrice = sortPriceSelect?.value || "";

  filteredProducts = [...products].reverse().filter(product => {
    const matchesName = (product.name || "").toLowerCase().includes(searchName);

    const matchesCategory = selectedCategory
      ? (product.category || "").toLowerCase() === selectedCategory.toLowerCase()
      : true;

    return matchesName && matchesCategory;
  });

  if (sortPrice === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortPrice === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  currentPage = 1;
  renderProducts();
  renderPagination();
  updateProductsCount();
}

function updateProductsCount() {
  if (!productsCountEl) return;
  productsCountEl.textContent = `${filteredProducts.length} product(s) found`;
}

function getPaginatedProducts() {
  const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;
  return filteredProducts.slice(start, end);
}

function renderPagination() {
  if (!paginationEl) return;

  paginationEl.innerHTML = "";

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  if (totalPages <= 1) return;

  paginationEl.innerHTML += `
    <li class="${currentPage === 1 ? "disabled" : ""}">
      <button type="button" data-page="prev">Prev</button>
    </li>
  `;

  for (let i = 1; i <= totalPages; i++) {
    paginationEl.innerHTML += `
      <li class="${currentPage === i ? "active" : ""}">
        <button type="button" data-page="${i}">
          ${String(i).padStart(2, "0")}
        </button>
      </li>
    `;
  }

  paginationEl.innerHTML += `
    <li class="${currentPage === totalPages ? "disabled" : ""}">
      <button type="button" data-page="next">Next</button>
    </li>
  `;
}

function initProductFilters() {
  if (searchByNameInput) {
    searchByNameInput.addEventListener("input", applyFilters);
  }

  if (filterCategorySelect) {
    filterCategorySelect.addEventListener("change", applyFilters);
  }

  if (sortPriceSelect) {
    sortPriceSelect.addEventListener("change", applyFilters);
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener("click", () => {
      if (searchByNameInput) searchByNameInput.value = "";
      if (filterCategorySelect) filterCategorySelect.value = "";
      if (sortPriceSelect) sortPriceSelect.value = "";

      filteredProducts = [...products].reverse();
      currentPage = 1;

      renderProducts();
      renderPagination();
      updateProductsCount();
    });
  }

  if (paginationEl) {
    paginationEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
      const page = btn.dataset.page;

      if (page === "prev" && currentPage > 1) {
        currentPage--;
      } else if (page === "next" && currentPage < totalPages) {
        currentPage++;
      } else if (!isNaN(parseInt(page))) {
        currentPage = parseInt(page);
      }

      renderProducts();
      renderPagination();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
}

/* =========================================================
   PRODUCT LIST PAGE
========================================================= */

function renderProducts() {
  if (!container) return;

  container.innerHTML = "";

  const pageProducts = getPaginatedProducts();

  if (!pageProducts.length) {
    container.innerHTML = `
      <div class="col-12">
        <div class="empty-products text-center py-5">
          <i class="fa-solid fa-box-open fs-1 mb-3"></i>
          <h4>No products found</h4>
          <p>Try changing search or filter values.</p>
        </div>
      </div>
    `;
    return;
  }

  pageProducts.forEach(product => {
    const hasOldPrice = product.oldPrice && product.oldPrice > product.price;

    const discount = hasOldPrice
      ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
      : 0;

    const isOutOfStock = !product.stock || product.stock <= 0;

    container.innerHTML += `
      <div class="col-md-6 col-lg-3">
        <div class="product-card h-100">
          <div class="product-image-wrapper">
            <img 
              src="${product.image}" 
              class="product-image view-product"
              data-id="${product.id}"
              alt="${product.name}"
            >

            <div class="product-badges">
              ${product.badge ? `<span class="badge-new">${product.badge}</span>` : ""}
              ${discount > 0 ? `<span class="badge-discount">-${discount}%</span>` : ""}
              ${isOutOfStock ? `<span class="badge-stock out-of-stock">Out of Stock</span>` : ""}
            </div>

            <div class="product-actions">
              <button class="action-btn view-product" data-id="${product.id}">
                <i class="fa-solid fa-eye"></i>
              </button>

              <button class="action-btn add-to-cart" data-id="${product.id}" ${isOutOfStock ? "disabled" : ""}>
                <i class="fas fa-shopping-cart"></i>
              </button>

              <button class="action-btn add-to-wishlist" data-id="${product.id}">
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
              ${hasOldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ""}
              <span class="current-price">$${product.price.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

/* =========================================================
   EVENTS (PRODUCT LIST)
========================================================= */

if (container) {
  container.addEventListener("click", function (e) {
    const viewBtn = e.target.closest(".view-product");

    if (viewBtn) {
      const id = viewBtn.dataset.id;
      window.location.href = `product-details.html?id=${id}`;
      return;
    }

    const cartBtn = e.target.closest(".add-to-cart");

    if (cartBtn) {
      const id = parseInt(cartBtn.dataset.id);
      addProductToCart(id, 1);
      return;
    }

    const wishBtn = e.target.closest(".add-to-wishlist");

    if (wishBtn) {
      const id = parseInt(wishBtn.dataset.id);
      addProductToWishlist(id);
    }
  });
}

/* =========================================================
   PRODUCT DETAILS PAGE
========================================================= */

function renderProductDetails() {
  const mainImages = document.getElementById("mainImages");
  const thumbImages = document.getElementById("thumbImages");
  const stockBadgeEl = document.getElementById("productStockBadge");

  if (!mainImages || !thumbImages) return;

  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"));
  const product = products.find(p => p.id === productId);

  if (!product) return;

  const isOutOfStock = !product.stock || product.stock <= 0;
  const hasOldPrice = product.oldPrice && product.oldPrice > product.price;

  document.getElementById("productName").textContent = product.name;
  document.getElementById("productPrice").textContent = `$${product.price.toFixed(2)}`;

  const oldPriceEl = document.getElementById("oldPrice");
  if (oldPriceEl) {
    if (hasOldPrice) {
      oldPriceEl.textContent = `$${product.oldPrice.toFixed(2)}`;
    } else {
      oldPriceEl.textContent = "";
    }
  }

  document.getElementById("productDescription").textContent = product.description || "";

  const categoryEl = document.getElementById("productCategories");
  if (categoryEl) {
    categoryEl.textContent = product.category || "Uncategorized";
  }

  renderRating(product.rating || 0, product.reviews?.length || 0);

  if (stockBadgeEl) {
    stockBadgeEl.innerHTML = isOutOfStock
      ? `<span class="badge-stock out-of-stock">Out of Stock</span>`
      : "";
  }

  mainImages.innerHTML = "";
  thumbImages.innerHTML = "";

  const images = product.images && product.images.length
    ? product.images
    : [product.image];

  images.forEach(img => {
    mainImages.innerHTML += `
      <div class="swiper-slide">
        <img src="${img}" class="img-fluid" alt="${product.name}">
      </div>
    `;

    thumbImages.innerHTML += `
      <div class="swiper-slide">
        <img src="${img}" class="img-fluid" alt="${product.name}">
      </div>
    `;
  });

  const thumbs = new Swiper(".thumbsSwiper", {
    spaceBetween: 10,
    slidesPerView: 4,
    watchSlidesProgress: true
  });

  new Swiper(".mainSwiper", {
    spaceBetween: 10,
    thumbs: { swiper: thumbs }
  });

  const cartBtn = document.getElementById("addToCartBtn");
  if (cartBtn) {
    cartBtn.disabled = isOutOfStock;

    if (isOutOfStock) {
      cartBtn.classList.add("disabled");
      cartBtn.innerHTML = `<i class="fa-solid fa-ban me-2"></i>Out of Stock`;
    }

    cartBtn.addEventListener("click", () => {
      if (isOutOfStock) {
        showToast("This product is out of stock ❌", "warning");
        return;
      }

      const qty = parseInt(document.getElementById("qty").value) || 1;
      addProductToCart(productId, qty);
    });
  }

  const qtyInput = document.getElementById("qty");
  if (qtyInput && isOutOfStock) {
    qtyInput.value = 1;
    qtyInput.disabled = true;
  }

  const wishBtn = document.getElementById("addToWishlistBtn");
  if (wishBtn) {
    wishBtn.addEventListener("click", () => {
      addProductToWishlist(productId);
    });
  }
}

function renderRating(rating, reviewsCount) {
  const ratingEl = document.getElementById("productRating");
  const reviewCountEl = document.getElementById("reviewCount");

  if (!ratingEl || !reviewCountEl) return;

  ratingEl.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      ratingEl.innerHTML += `<i class="fa-solid fa-star"></i>`;
    } else {
      ratingEl.innerHTML += `<i class="fa-regular fa-star"></i>`;
    }
  }

  reviewCountEl.textContent =
    `(${reviewsCount} customer review${reviewsCount !== 1 ? "s" : ""})`;
}

/* =========================================================
   TOAST
========================================================= */

function showToast(message, type = "success") {
  const toastHTML = `
    <div class="toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3 z-3">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
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

  setTimeout(() => {
    wrapper.remove();
  }, 3000);
}

/* ---------------- Initialize ---------------- */

populateCategories();

filteredProducts = [...products].reverse();

renderProducts();
renderPagination();
updateProductsCount();
initProductFilters();

renderProductDetails();
updateCartBadge();
updateWishListBadge();