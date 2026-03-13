import { storage } from "./storage.js";
import { STORAGE_KEYS } from "./storage-keys.js";

export function renderNavbar() {

    const nav = document.querySelector("nav");
    if (!nav) return;

    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

    /* ---------------- prefix ---------------- */

    function computePrefix() {

        const moduleUrl = new URL(import.meta.url);
        const modulePath = decodeURIComponent(moduleUrl.pathname);
        const marker = "/shared/js/navbar.js";
        const markerIdx = modulePath.lastIndexOf(marker);

        if (markerIdx === -1) return "";

        const rootPath = modulePath.substring(0, markerIdx) + "/";

        const pagePath = decodeURIComponent(window.location.pathname);
        const pageDir = pagePath.substring(0, pagePath.lastIndexOf("/") + 1);

        if (pageDir.startsWith(rootPath)) {

            const relative = pageDir.substring(rootPath.length);
            const depth = relative.split("/").filter(Boolean).length;

            return "../".repeat(depth);

        }

        return "";

    }

    const prefix = computePrefix();

    /* ---------------- theme ---------------- */

    const theme = localStorage.getItem("theme") || "light";

    applyTheme(theme);

    const themeIcon = theme === "dark" ? "fa-sun" : "fa-moon";

    nav.className =
        theme === "dark"
            ? "navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3"
            : "navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3";

    const textClass = theme === "dark" ? "text-light" : "text-dark";

    /* ---------------- HTML ---------------- */

    nav.innerHTML = `

<div class="container">

<!-- LOGO -->

<a class="navbar-brand" href="${prefix}index.html">

<img src="${prefix}assets/images/logo-DXjmQiDB.svg" height="40">

</a>


<!-- MOBILE TOGGLER -->

<button class="navbar-toggler"

type="button"

data-bs-toggle="offcanvas"

data-bs-target="#mobileMenu">

<span class="navbar-toggler-icon"></span>

</button>


<!-- DESKTOP MENU -->

<div class="navbar-collapse d-none d-lg-flex">

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
<a class="nav-link ${textClass}" href="${prefix}features/aboutus/aboutus.html">About Us</a>
</li>

<li class="nav-item">
<a class="nav-link ${textClass}" href="${prefix}features/contact/contact.html">Contact Us</a>
</li>

</ul>


<ul class="navbar-nav align-items-center gap-3">

<li class="nav-item">

<button class="btn nav-link" id="themeToggleBtn">

<i class="fa-solid ${themeIcon}"></i>

</button>

</li>

${renderRightSide(currentUser, prefix, textClass)}

</ul>

</div>


<!-- MOBILE MENU -->

<div class="offcanvas offcanvas-end d-lg-none"

tabindex="-1"

id="mobileMenu">

<div class="offcanvas-header">

<h5 class="offcanvas-title">Menu</h5>

<button type="button"

class="btn-close"

data-bs-dismiss="offcanvas">

</button>

</div>


<div class="offcanvas-body">

<ul class="navbar-nav gap-3 fw-semibold">

<li class="nav-item">
<a class="nav-link" href="${prefix}features/home/home.html">Home</a>
</li>

<li class="nav-item">
<a class="nav-link" href="${prefix}features/products/products-list.html">Products</a>
</li>

<li class="nav-item">
<a class="nav-link" href="${prefix}features/aboutus/aboutus.html">About Us</a>
</li>

<li class="nav-item">
<a class="nav-link" href="${prefix}features/contact/contact.html">Contact Us</a>
</li>

</ul>

<hr>

<ul class="navbar-nav gap-3">

${renderRightSide(currentUser, prefix, textClass)}

</ul>

</div>

</div>

</div>

`;

    attachLogout();
    updateCartBadge();
    updateWishListBadge();
    setActiveLink();
    attachThemeToggle();

}

/* ---------------- right side ---------------- */

function renderRightSide(currentUser, prefix, textClass) {

    if (currentUser && currentUser.role) {

        if (currentUser.role === "customer") {

            return `

<li class="nav-item">

<a class="nav-link position-relative ${textClass}"

href="${prefix}features/wishlist/wishlist.html">

<i class="fa-regular fa-heart fs-5"></i>

<span class="wishList-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">0</span>

</a>

</li>


<li class="nav-item">

<a class="nav-link position-relative ${textClass}"

href="${prefix}features/cart/cart.html">

<i class="fa-solid fa-bag-shopping fs-5"></i>

<span class="cart-badge position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"></span>

</a>

</li>


<li class="nav-item dropdown">

<button 
class="btn nav-link dropdown-toggle border-0 ${textClass}" 
data-bs-toggle="dropdown"
>

<i class="fa-regular fa-user fs-5"></i>

</button>

<ul class="dropdown-menu dropdown-menu-end shadow">

<li>
<a class="dropdown-item" href="${prefix}features/customer/myOrders/order.html">
<i class="fa-solid fa-box me-2"></i>
My Orders
</a>
</li>

<li>
<a class="dropdown-item" href="${prefix}features/customer/profile/profile.html">
<i class="fa-solid fa-user me-2"></i>
My Profile
</a>
</li>

<li><hr class="dropdown-divider"></li>

<li>
<button class="dropdown-item text-danger" id="logoutBtn">
<i class="fa-solid fa-right-from-bracket me-2"></i>
Logout
</button>
</li>

</ul>

</li>

`;

        }

        if (currentUser.role === "seller") {

            return `

<li class="nav-item">

<a class="nav-link ${textClass}"

href="${prefix}features/seller/dashboard.html">

<i class="fa-solid fa-gauge fs-5"></i> Dashboard

</a>

</li>

<li class="nav-item">

<button class="btn border-0 nav-link ${textClass}" id="logoutBtn">

<i class="fa-solid fa-right-from-bracket fs-5"></i>

</button>

</li>

`;

        }

        if (currentUser.role === "admin") {

            return `

<li class="nav-item">

<button class="btn border-0 nav-link ${textClass}" id="logoutBtn">

<i class="fa-solid fa-right-from-bracket fs-5"></i>

</button>

</li>

`;

        }

    }

    return `

<li class="nav-item">

<a class="nav-link ${textClass}"

href="${prefix}features/auth/login.html">

Login

</a>

</li>

<li class="nav-item">

<a class="nav-link ${textClass}"

href="${prefix}features/auth/register.html">

Register

</a>

</li>

`;

}

/* ---------------- theme ---------------- */

function applyTheme(theme) {

    document.body.classList.toggle("theme-dark", theme === "dark");

    if (theme === "dark")
        document.documentElement.setAttribute("data-bs-theme", "dark");
    else
        document.documentElement.setAttribute("data-bs-theme", "light");

}

function attachThemeToggle() {

    const btn = document.getElementById("themeToggleBtn");

    if (!btn) return;

    btn.addEventListener("click", () => {

        const current = localStorage.getItem("theme") || "light";

        const next = current === "light" ? "dark" : "light";

        localStorage.setItem("theme", next);

        applyTheme(next);

        renderNavbar();

    });

}

/* ---------------- logout ---------------- */

function attachLogout() {

    const logoutBtn = document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener("click", function () {

            storage.remove(STORAGE_KEYS.CURRENT_USER);

            window.location.href = "../../index.html";

        });

    }

}

/* ---------------- cart badge ---------------- */

export function updateCartBadge() {

    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);
    if (!currentUser) return;

    const cartKey = `cart_${currentUser.id}`;
    const cart = storage.get(cartKey) || [];

    const badges = document.querySelectorAll(".cart-badge");

    badges.forEach(badge => {

        if (cart.length > 0) {

            badge.textContent = cart.length;
            badge.style.display = "inline-block";

        } else {

            badge.style.display = "none";

        }

    });

}

/* ---------------- wishlist badge ---------------- */

export function updateWishListBadge() {

    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);
    if (!currentUser) return;

    const wishKey = `wishlist_${currentUser.id}`;
    const wishList = storage.get(wishKey) || [];

    const badges = document.querySelectorAll(".wishList-badge");

    badges.forEach(badge => {

        if (wishList.length > 0) {

            badge.textContent = wishList.length;
            badge.style.display = "inline-block";

        } else {

            badge.style.display = "none";

        }

    });

}

/* ---------------- active link ---------------- */

function setActiveLink() {

    let currentPage = window.location.pathname.split("/").pop().toLowerCase();
    if (!currentPage) currentPage = "index.html";

    const homePages = new Set(["index.html", "home.html"]);

    document.querySelectorAll(".navbar .nav-link").forEach(link => {

        const href = (link.getAttribute("href") || "").toLowerCase();
        if (!href || href.startsWith("#")) return;

        const linkPage = href.split("/").pop();

        if (homePages.has(currentPage) && homePages.has(linkPage))
            link.classList.add("active");

        else if (linkPage === currentPage)
            link.classList.add("active");

        else
            link.classList.remove("active");

    });

}

export { applyTheme };