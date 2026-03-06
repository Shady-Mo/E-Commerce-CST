import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { renderNavbar, updateCartBadge, updateWishListBadge } from "../../shared/js/navbar.js";
import { renderFooter } from "../../shared/js/footer.js";

/* ---------------- Layout ---------------- */

renderNavbar();
renderFooter();

/* ---------------- Auth Protection ---------------- */

const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);
if (!currentUser) window.location.href = "../auth/login.html";

/* ---------------- Setup ---------------- */

const wishKey = `wishlist_${currentUser.id}`;
const cartKey = `cart_${currentUser.id}`;

let wishList = storage.get(wishKey) || [];
let cart = storage.get(cartKey) || [];

const wishlistBody = document.getElementById("wishlistBody");

let productToDelete = null;

/* ---------------- Helpers ---------------- */

function getStockStatus(productId){
  // optional: try get product from PRODUCTS to decide stock
  const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];
  const p = allProducts.find(x => x.id === productId);

  // if you ever add stock: {stock:0} or {inStock:false}
  if (p && (p.stock === 0 || p.inStock === false)) return "out";
  return "in";
}

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

/* ---------------- Render Wishlist ---------------- */
function renderWishlist(){

  wishlistBody.innerHTML = "";

  const allProducts = storage.get(STORAGE_KEYS.PRODUCTS) || [];

  if (wishList.length === 0){
    wishlistBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-4">
          Your wishlist is empty 💛
        </td>
      </tr>
    `;
    return;
  }

  wishList.forEach(item => {

    // get real product
    const product = allProducts.find(p => p.id === item.productId);

    const isInStock = product && product.stock > 0;

    wishlistBody.innerHTML += `
      <tr>

        <td data-label="Image">
          <div class="wish-img-box">
            <img src="${item.image}" class="wish-img" alt="${item.name}">
          </div>
        </td>

        <td data-label="Product">
          <div class="wish-name">${item.name}</div>
        </td>

        <td data-label="Price">
          ${Number(item.price).toFixed(2)} EGP
        </td>

        <td data-label="Stock Status">
          <span class="${isInStock ? "stock-in" : "stock-out"}">
            ${isInStock ? "In Stock" : "Out of Stock"}
          </span>
        </td>

        <td data-label="Add to cart">
          <button 
            class="btn-wish-add add-to-cart" 
            data-id="${item.productId}"
            ${!isInStock ? "disabled" : ""}
          >
            Add To Cart
          </button>
        </td>

        <td data-label="Remove">
          <button 
            class="wish-remove remove" 
            data-id="${item.productId}" 
            title="Remove">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>

      </tr>
    `;
  });
}

/* ---------------- Events ---------------- */

wishlistBody.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".add-to-cart");
  const removeBtn = e.target.closest(".remove");

  // Remove -> modal
  if (removeBtn){
    productToDelete = parseInt(removeBtn.dataset.id, 10);
    const modalEl = document.getElementById("deleteModal");
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
    return;
  }

  // Add to cart
  if (addBtn){

  const productId = parseInt(addBtn.dataset.id, 10);
  const item = wishList.find(x => x.productId === productId);
  if (!item) return;

  const products = storage.get(STORAGE_KEYS.PRODUCTS) || [];
  const product = products.find(p => p.id === productId);

  if (!product || product.stock <= 0){
    showToast("Product is out of stock", "warning");
    return;
  }

  const existing = cart.find(x => x.productId === productId);

  if (existing){
    existing.quantity += 1;
  } else {
    cart.push({
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
  }

  // decrease stock
  product.stock -= 1;

  storage.set(STORAGE_KEYS.PRODUCTS, products);
  storage.set(cartKey, cart);

  updateCartBadge();
  showToast("Added to cart ✔", "success");

  renderWishlist();
}
});

/* ---------------- Confirm Delete ---------------- */

document.getElementById("confirmDelete").addEventListener("click", () => {
  if (!productToDelete) return;

  wishList = wishList.filter(x => x.productId !== productToDelete);
  storage.set(wishKey, wishList);

  renderWishlist();
  updateWishListBadge();

  productToDelete = null;

  const modalEl = document.getElementById("deleteModal");
  const modal = bootstrap.Modal.getInstance(modalEl);
  modal.hide();
});

/* ---------------- Init ---------------- */

renderWishlist();
updateCartBadge();
updateWishListBadge();