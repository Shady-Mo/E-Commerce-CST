import { storage } from "./storage.js";
import { STORAGE_KEYS } from "./storage-keys.js";

export function renderNavbar() {

    const nav = document.querySelector("nav");
    if (!nav) return;

    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

    function computePrefix() {
        const moduleUrl = new URL(import.meta.url);
        const modulePath = decodeURIComponent(moduleUrl.pathname);
        const marker = "/shared/js/navbar.js";
        const markerIdx = modulePath.lastIndexOf(marker);
        if (markerIdx === -1) {
            console.warn("computePrefix: could not locate navbar.js path", modulePath);
            return "";
        }
        const rootPath = modulePath.substring(0, markerIdx) + "/";

        const pagePath = decodeURIComponent(window.location.pathname);
        const pageDir = pagePath.substring(0, pagePath.lastIndexOf("/") + 1);

        if (pageDir.startsWith(rootPath)) {
            const relative = pageDir.substring(rootPath.length);
            const depth = relative.split("/").filter(Boolean).length;
            if (depth === 0) return "";
            return "../".repeat(depth);
        }

        return "";
    }
    const prefix = computePrefix();
    console.debug("navbar prefix", prefix);

    const theme = localStorage.getItem('theme') || 'light';

    applyTheme(theme);

    const themeIcon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
    if (theme === 'dark') {
        nav.className = "navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3";
    } else {
        nav.className = "navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3";
    }

    const textClass = theme === 'dark' ? 'text-light' : 'text-dark';
    nav.innerHTML = `
    <div class="container">

        <!-- Logo -->
        <a class="navbar-brand" href="${prefix}index.html">
            <img src="${prefix}assets/images/logo-DXjmQiDB.svg" alt="Logo" height="40">
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
                    <a class="nav-link ${textClass}" href="${prefix}features/home/home.html">Home</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${textClass}" href="${prefix}features/products/products-list.html">Products</a>
                </li>
                ${currentUser && currentUser.role === "admin"
            ? `<li class="nav-item">
                          <a class="nav-link ${textClass}" href="${prefix}features/admin/panel.html">Dashboard</a>
                       </li>`
            : ""
        }
                <li class="nav-item">
                    <a class="nav-link ${textClass}" href="#">About Us</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${textClass}" href="#">Contact Us</a>
                </li>
            </ul>

            <!-- Right Side -->
            <ul class="navbar-nav align-items-center gap-3">
                <!-- theme toggle -->
                <li class="nav-item">
                  <button class="btn nav-link" id="themeToggleBtn">
                    <i class="fa-solid ${themeIcon}"></i>
                  </button>
                </li>
                ${currentUser &&
            (currentUser.role === "customer" ||
                currentUser.role === "admin" ||
                currentUser.role === "seller"
            )
            ? `

<!-- Wishlist -->
<li class="nav-item">
<a class="nav-link position-relative ${textClass}" href="${prefix}features/wishlist/wishlist.html">
    <i class="fa-regular fa-heart fs-5"></i>
        <span class="wishList-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>
    </a>
</li>

                        <!-- Cart -->
                        <li class="nav-item">
                            <a class="nav-link position-relative ${textClass}" href="${prefix}features/cart/cart.html">
                                <i class="fa-solid fa-bag-shopping fs-5"></i>
                                <span class="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"></span>
                            </a>
                        </li>

                        <!-- Logout -->
                        <li class="nav-item">
                            <button class="btn border-0 nav-link ${textClass}" id="logoutBtn">
                                <i class="fa-solid fa-right-from-bracket fs-5"></i>
                            </button>
                        </li>
                    `
            :
            `
                        <li class="nav-item">
                            <a class="nav-link ${textClass}" href="${prefix}features/auth/login.html">
                                Login
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${textClass}" href="${prefix}features/auth/register.html">
                                Register
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
    attachThemeToggle();
}

function applyTheme(theme) {
    document.body.classList.toggle("theme-dark", theme === "dark");

    if (theme === "dark") {
        document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-bs-theme", "light");
    }
}

function attachThemeToggle() {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const current = localStorage.getItem('theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', next);
        applyTheme(next);
        renderNavbar();
    });
}

function attachLogout() {

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            storage.remove(STORAGE_KEYS.CURRENT_USER);
            window.location.href = "../../index.html";
        });
    }
}

export function updateCartBadge() {

    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);
    if (!currentUser) return;

    const cartKey = `cart_${currentUser.id}`;
    const cart = storage.get(cartKey) || [];

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

// export function updateWishListBadge() {
//     const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);
//     if (!currentUser) return;

//     const wishKey = `wishlist_${currentUser.id}`;
//     const wishList = storage.get(wishKey) || [];
//     const badgeEl = document.getElementById("wishListBadge");
//     if (badgeEl) badgeEl.textContent = wishList.length;
// }

// export function updateWishListBadge() { 
//     const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER); 
//     if (!currentUser) return; 

//     const wishKey = `wishlist_${currentUser.id}`; 
//     const wishList = storage.get(wishKey) || []; 

//     const badgeEl = document.querySelector(".wishList-badge"); // use querySelector for class
//     if (!badgeEl) return;

//     if (wishList.length > 0) {
//         badgeEl.textContent = wishList.length;
//         badgeEl.style.display = "inline-block";
//     } else {
//         badgeEl.style.display = "none";
//     }
// } 

export function updateWishListBadge() { 
    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER); 
    if (!currentUser) return; 

    const wishKey = `wishlist_${currentUser.id}`; 
    const wishList = storage.get(wishKey) || []; 

    const badgeEl = document.querySelector(".wishList-badge"); // ✅ correct
    if (!badgeEl) return;

    if (wishList.length > 0) {
        badgeEl.textContent = wishList.length;
        badgeEl.style.display = "inline-block";
    } else {
        badgeEl.style.display = "none";
    }
}



function setActiveLink() {

    const currentPage = window.location.pathname.split("/").pop();

    document.querySelectorAll(".navbar .nav-link").forEach(link => {

        const href = link.getAttribute("href");
        if (!href) return;

        const linkPage = href.split("/").pop();

        if (linkPage === currentPage) {
            link.classList.add("active");
        }
    });
}

export { applyTheme };
