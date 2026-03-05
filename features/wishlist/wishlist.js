import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { renderNavbar, updateWishListBadge } from "../../shared/js/navbar.js";
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
const wishKey = `wishlist_${currentUser.id}`;
let wishList = storage.get(wishKey) || [];

const wishListBody = document.getElementById("wishListBody");

let productToDelete = null;

/* ---------------- Render Wishlist ---------------- */
function renderWishlist() {
    wishListBody.innerHTML = "";

    if (wishList.length === 0) {
        wishListBody.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-4">
                    Your wishlist is empty 💔
                </td>
            </tr>
        `;
        updateWishListBadge();
        return;
    }

    wishList.forEach(item => {
        wishListBody.innerHTML += `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <img src="${item.image}" width="80" height="80" style="object-fit:cover;">
                        <div class="fw-semibold">${item.name}</div>
                    </div>
                </td>
                <td>${item.price} EGP</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger remove" data-id="${item.productId}">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    updateWishListBadge();
}

/* ---------------- Events ---------------- */
wishListBody.addEventListener("click", function (e) {
    const productId = parseInt(e.target.dataset.id);

    if (!productId) return;

    if (e.target.classList.contains("remove") || e.target.closest(".remove")) {
        productToDelete = productId;

        const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
        modal.show();

        return;
    }
});

/* ---------------- Confirm Delete ---------------- */
document.getElementById("confirmDelete").addEventListener("click", function () {
    if (!productToDelete) return;

    wishList = wishList.filter(p => p.productId !== productToDelete);
    storage.set(wishKey, wishList);

    renderWishlist();

    productToDelete = null;

    const modalEl = document.getElementById("deleteModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
});

/* ---------------- Initialize ---------------- */
renderWishlist();
updateWishListBadge();