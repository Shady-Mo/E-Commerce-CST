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


/* =========================================================
   GLOBAL FUNCTIONS (NO REPEAT LOGIC)
========================================================= */

function addProductToCart(productId, qty = 1){

const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

if(!currentUser){

showToast("You must login first to add items to cart.","warning");

setTimeout(()=>{
window.location.href="../../features/auth/login.html";
},1500);

return;
}

const cartKey = `cart_${currentUser.id}`;

let cart = storage.get(cartKey) || [];

const product = products.find(p => p.id === productId);

if(!product) return;

/* stock check */

if(product.stock < qty){

showToast("Not enough stock ❌","warning");
return;

}

const existingItem = cart.find(item => item.productId === productId);

if(existingItem){

existingItem.quantity += qty;

}else{

cart.push({
productId: product.id,
name: product.name,
price: product.price,
image: product.image,
quantity: qty
});

}

/* decrease stock */

product.stock -= qty;

storage.set(STORAGE_KEYS.PRODUCTS, allProducts);
storage.set(cartKey, cart);

updateCartBadge();

showToast("Product added to cart ✔","success");

}



function addProductToWishlist(productId){

const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

if(!currentUser){

showToast("You must login first.","warning");

setTimeout(()=>{
window.location.href="../../features/auth/login.html";
},1500);

return;

}

const wishKey = `wishlist_${currentUser.id}`;

let wishList = storage.get(wishKey) || [];

const product = products.find(p => p.id === productId);

if(!product) return;

const existing = wishList.find(item => item.productId === productId);

if(existing){

showToast("Already in wishlist","info");
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

showToast("Product added to wishlist ✔","success");

}



/* =========================================================
   PRODUCT LIST PAGE
========================================================= */

function renderProducts(){

if(!container) return;

container.innerHTML = "";

products.forEach(product => {

const hasOldPrice = product.oldPrice && product.oldPrice > product.price;

const discount = hasOldPrice ?
Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

container.innerHTML += `
<div class="col-md-4 col-lg-3 mb-4">

<div class="product-card h-100">

<div class="product-image-wrapper">

<img 
src="${product.image}" 
class="product-image view-product"
data-id="${product.id}"
alt="${product.name}"
>

<div class="product-badges">

${product.badge ? `<span class="badge-new">${product.badge}</span>` : ''}

${discount > 0 ? `<span class="badge-discount">-${discount}%</span>` : ''}

</div>

<div class="product-actions">

<button class="action-btn view-product" data-id="${product.id}">
<i class="fa-solid fa-eye"></i>
</button>

<button class="action-btn add-to-cart" data-id="${product.id}">
<i class="fas fa-shopping-cart"></i>
</button>

<button class="action-btn add-to-wishList" data-id="${product.id}">
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



/* =========================================================
   EVENTS (PRODUCT LIST)
========================================================= */

if(container){

container.addEventListener("click",function(e){

const viewBtn = e.target.closest(".view-product");

if(viewBtn){

const id = viewBtn.dataset.id;

window.location.href =
`product-details.html?id=${id}`;

return;

}

/* add to cart */

const cartBtn = e.target.closest(".add-to-cart");

if(cartBtn){

const id = parseInt(cartBtn.dataset.id);

addProductToCart(id,1);

}

/* wishlist */

const wishBtn = e.target.closest(".add-to-wishList");

if(wishBtn){

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

  if (!mainImages || !thumbImages) return;

  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get("id"));
  const product = products.find(p => p.id === productId);

  if (!product) return;

  /* render text */
  document.getElementById("productName").textContent = product.name;

  document.getElementById("productPrice").textContent =
    `$${product.price.toFixed(2)}`;

  const oldPriceEl = document.getElementById("oldPrice");
  if (product.oldPrice) {
    oldPriceEl.textContent = `$${product.oldPrice.toFixed(2)}`;
  } else {
    oldPriceEl.textContent = "";
  }

  document.getElementById("productDescription").textContent =
    product.description || "";

  /* render category */
  const categoryEl = document.getElementById("productCategories");
  if (categoryEl) {
    categoryEl.textContent = product.category || "Uncategorized";
  }

  /* render rating + reviews */
  renderRating(product.rating || 0, product.reviewsCount || 0);

  /* images */
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

  /* swiper */
  const thumbs = new Swiper(".thumbsSwiper", {
    spaceBetween: 10,
    slidesPerView: 4,
    watchSlidesProgress: true
  });

  new Swiper(".mainSwiper", {
    spaceBetween: 10,
    thumbs: { swiper: thumbs }
  });

  /* add to cart */
  const cartBtn = document.getElementById("addToCartBtn");
  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      const qty = parseInt(document.getElementById("qty").value) || 1;
      addProductToCart(productId, qty);
    });
  }

  /* wishlist */
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

renderProductDetails();



/* =========================================================
   TOAST
========================================================= */

function showToast(message,type="success"){

const toastHTML = `
<div class="toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 end-0 m-3">
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

setTimeout(()=>{
wrapper.remove();
},3000);

}


/* ---------------- Initialize ---------------- */

renderProducts();
updateCartBadge();
updateWishListBadge();