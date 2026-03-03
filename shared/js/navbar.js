import { storage } from "./storage.js";
import { STORAGE_KEYS } from "./storage-keys.js";

export function renderNavbar() {

    const nav = document.querySelector("nav");
    if (!nav) return;

    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

    // figure out how far we are from project root so links always resolve
    function computePrefix() {
        // decode in case spaces or encoded characters appear
        const raw = decodeURIComponent(window.location.pathname);
        const parts = raw.split("/");
        // look for the project folder name, case-insensitive
        const root = "e-commerce-cst";
        const idx = parts.findIndex(p => p.toLowerCase() === root);
        if (idx === -1) {
            console.warn("computePrefix: root folder not found in path", parts);
            return "";
        }
        // calculate depth after root, excluding the file name itself
        let depth = parts.length - idx - 2;
        if (depth < 0) depth = 0;
        if (depth === 0) return "";
        return "../".repeat(depth);
    }
    const prefix = computePrefix();
    console.debug("navbar prefix", prefix);

    // determine theme
    const theme = localStorage.getItem('theme') || 'light';

    // apply to document so all pages switch
    applyTheme(theme);

    const themeIcon = theme === 'dark' ? 'fa-sun' : 'fa-moon';
    if (theme === 'dark') {
        nav.className = "navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3";
    } else {
        nav.className = "navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3";
    }

    // choose link color
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
                ${
                    currentUser && currentUser.role === "admin"
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
                ${
                    currentUser && currentUser.role === "customer"
                    ? `
                        <!-- Wishlist -->
                        <li class="nav-item">
                            <a class="nav-link ${textClass}" href="${prefix}features/wishlist/wishlist.html">
                                <i class="fa-regular fa-heart fs-5"></i>
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

// -- theme helpers ------------------------------------------------------

function applyTheme(theme) {
    // add a class to body so global styles can target dark mode
    document.body.classList.toggle("theme-dark", theme === "dark");

    // also set Bootstrap's theme attribute on the root element so its
    // built-in CSS variables flip automatically
    if (theme === "dark") {
        document.documentElement.setAttribute("data-bs-theme", "dark");
    } else {
        document.documentElement.setAttribute("data-bs-theme", "light");
    }
}

// -- theme toggle handlers ------------------------------------------------
function attachThemeToggle() {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const current = localStorage.getItem('theme') || 'light';
        const next = current === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', next);
        applyTheme(next);
        // re-render navbar to update classes and icon
        renderNavbar();
    });
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

/* ---------------- Active Link ---------------- */

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
