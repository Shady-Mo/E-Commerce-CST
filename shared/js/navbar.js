import { storage } from "./storage.js";
import { STORAGE_KEYS } from "./storage-keys.js";

export function renderNavbar() {
    const nav = document.querySelector("nav");
    if (!nav) return;

    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);
   
    nav.className = "navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3";

    nav.innerHTML = `
    <div class="container">

        <!-- Logo (Replace src with your logo image) -->
        <a class="navbar-brand" href="../../features/home/home.html">
            <img src="../../assets/images/logo-DXjmQiDB.svg" alt="Logo" height="40">
        </a>

        <button class="navbar-toggler" type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarNav">

            <!-- Middle Links -->
            <ul class="navbar-nav mx-auto gap-4 fw-semibold">
                <li class="nav-item">
                    <a class="nav-link text-dark" href="../../features/home/home.html">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark" href="../../features/products/products-list.html">Products</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark" href="#">About Us</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link text-dark" href="#">Contact Us</a>
                </li>
            </ul>

            <!-- Right Side -->
            <ul class="navbar-nav align-items-center gap-3">

                ${
                    currentUser && currentUser.role === "customer"
                    ? `
                    <!-- Wishlist -->
                    <li class="nav-item">
                        <a class="nav-link text-dark" href="../../features/wishlist/wishlist.html">
                            <i class="fa-regular fa-heart fs-5"></i>
                        </a>
                    </li>

                    <!-- Cart -->
                    <li class="nav-item">
                        <a class="nav-link position-relative text-dark" href="../../features/cart/cart.html">
                            <i class="fa-solid fa-bag-shopping fs-5"></i>
                            <span class="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"></span>
                        </a>
                    </li>

                   

                    <!-- Logout Icon -->
                    <li class="nav-item">
                        <button class="btn border-0 nav-link text-dark" id="logoutBtn">
                            <i class="fa-solid fa-right-from-bracket fs-5"></i>
                        </button>
                    </li>
                    `
                    :
                    `
                    <!-- Guest -->
                    <li class="nav-item">
                        <a class="nav-link text-dark" href="../../features/auth/login.html">
                            Login
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link text-dark" href="../../features/auth/register.html">
                            register
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
    setActiveLink();
}


/* ---------------- Logout ---------------- */

function attachLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            storage.remove(STORAGE_KEYS.CURRENT_USER);
            window.location.href = "../../index.html";
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

/* ---------------- Active Link ---------------- */

function setActiveLink() {

    const currentPath = window.location.pathname;

    document.querySelectorAll(".navbar .nav-link").forEach(link => {

        link.classList.remove("active");

        const href = link.getAttribute("href");
        if (!href || href === "#") return;
        if (currentPath.includes(href.replace("../../", ""))) {
            link.classList.add("active");
        }

    });
}