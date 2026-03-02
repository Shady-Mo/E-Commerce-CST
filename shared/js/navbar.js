import { storage } from "./storage.js";
import { STORAGE_KEYS } from "./storage-keys.js";

export function renderNavbar() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

    nav.className = "navbar navbar-expand-lg navbar-dark bg-dark";

    nav.innerHTML = `
        <div class="container-fluid">
            <a class="navbar-brand" href="/index.html">
                <i class="fa-solid fa-store"></i> E-Commerce
            </a>

            <button class="navbar-toggler" type="button" 
                data-bs-toggle="collapse" 
                data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center">

                    ${
                        currentUser && currentUser.role === "customer"
                        ? `
                        <!-- Wishlist -->
                        <li class="nav-item">
                            <a class="nav-link" href="/features/wishlist/wishlist.html">
                                <i class="fa-regular fa-heart"></i>
                            </a>
                        </li>

                        <!-- Cart -->
                        <li class="nav-item">
                            <a class="nav-link position-relative cart-link" href="/features/cart/cart.html">
                                <i class="fa-solid fa-cart-arrow-down"></i>
                                <span class="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"></span>
                            </a>
                        </li>

                        <!-- Username -->
                        <li class="nav-item">
                            <span class="nav-link text-white">
                                Hi, ${currentUser.username}
                            </span>
                        </li>

                        <!-- Logout -->
                        <li class="nav-item">
                            <button class="btn btn-sm btn-outline-light ms-2" id="logoutBtn">
                                Logout
                            </button>
                        </li>
                        `
                        :
                        `
                        <li class="nav-item">
                            <a class="nav-link" href="/features/auth/login.html">
                                <i class="fa-solid fa-sign-in-alt"></i> Login
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/features/auth/register.html">
                                <i class="fa-solid fa-user-plus"></i> Register
                            </a>
                        </li>
                        `
                    }

                </ul>
            </div>
        </div>
    `;

    attachLogout();
    updateCartBadge();
}

/* ---------------- Logout ---------------- */

function attachLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            storage.remove(STORAGE_KEYS.CURRENT_USER);
            window.location.href = "/index.html";
        });
    }
}

/* ---------------- Cart Badge ---------------- */

export function updateCartBadge() {

    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);
    if (!currentUser) return;

    const cartKey = `cart_${currentUser.id}`;
    const cart = storage.get(cartKey);

    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

    const badge = document.querySelector(".cart-badge");
    if (!badge) return;

    if (totalQuantity > 0) {
        badge.textContent = totalQuantity;
        badge.style.display = "inline-block";
    } else {
        badge.style.display = "none";
    }
}