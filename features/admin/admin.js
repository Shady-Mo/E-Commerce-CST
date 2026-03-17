import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { applyTheme } from "../../shared/js/navbar.js";

import { renderDashboardHome } from "./admin-home.js";
import { renderUsers, initUserCreation, initEditUserForm, initUserSearch } from "./admin-users.js";
import { renderProducts, initProductSearch } from "./admin-products.js";
import { renderCustomerService, initCustomerServiceSearch } from "./admin-customers.js";

(function enforceAdminAccess() {
    const current = storage.get(STORAGE_KEYS.CURRENT_USER);
    if (!current || current.role !== "admin") {
        window.location.href = "../auth/login.html";
    }
})();

const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);
updateThemeIcon(savedTheme);

function updateThemeIcon(theme) {
    const btn = document.getElementById("themeToggleBtn");
    if (!btn) return;
    const icon = btn.querySelector("i");
    if (!icon) return;
    icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
}

const themeBtn = document.getElementById("themeToggleBtn");
if (themeBtn) {
    themeBtn.addEventListener("click", () => {
        const current = localStorage.getItem("theme") || "light";
        const next = current === "light" ? "dark" : "light";
        localStorage.setItem("theme", next);
        applyTheme(next);
        updateThemeIcon(next);
    });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        storage.remove(STORAGE_KEYS.CURRENT_USER);
        window.location.href = "../../index.html";
    });
}

function initSidebarNav() {
    const links = document.querySelectorAll(".sidebar-link[data-section]");
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const section = link.getAttribute("data-section");

            links.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            document.querySelectorAll(".admin-section").forEach(s => s.classList.remove("active"));
            const target = document.getElementById("section-" + section);
            if (target) target.classList.add("active");

            closeMobileSidebar();
        });
    });
}

function initMobileSidebar() {
    const toggleBtn = document.getElementById("sidebarToggle");
    const closeBtn = document.getElementById("sidebarClose");
    const overlay = document.getElementById("sidebarOverlay");

    if (toggleBtn) toggleBtn.addEventListener("click", openMobileSidebar);
    if (closeBtn) closeBtn.addEventListener("click", closeMobileSidebar);
    if (overlay) overlay.addEventListener("click", closeMobileSidebar);
}

function openMobileSidebar() {
    const sidebar = document.getElementById("adminSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    if (sidebar) sidebar.classList.add("open");
    if (overlay) overlay.classList.add("active");
}

function closeMobileSidebar() {
    const sidebar = document.getElementById("adminSidebar");
    const overlay = document.getElementById("sidebarOverlay");
    if (sidebar) sidebar.classList.remove("open");
    if (overlay) overlay.classList.remove("active");
}


export function showError(elementId, message) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = message;
    el.classList.remove("d-none");
}

function hideError(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = "";
    el.classList.add("d-none");
}

export function hideAllErrors(...ids) {
    ids.forEach((id) => hideError(id));
}

export function showConfirm(message, onConfirm) {
    const modalEl = document.getElementById('confirmModal');
    const body = document.getElementById('confirmModalBody');
    const btn = document.getElementById('confirmModalBtn');
    body.textContent = message;
    const handler = () => {
        btn.removeEventListener('click', handler);
        bootstrap.Modal.getInstance(modalEl).hide();
        onConfirm();
    };
    btn.addEventListener('click', handler);
    new bootstrap.Modal(modalEl).show();
}


document.addEventListener('DOMContentLoaded', () => {
    initSidebarNav();
    initMobileSidebar();

    renderDashboardHome();
    renderUsers();
    renderProducts();
    renderCustomerService();

    initUserCreation();
    initEditUserForm();
    initUserSearch();
    initProductSearch();
    initCustomerServiceSearch();
});
