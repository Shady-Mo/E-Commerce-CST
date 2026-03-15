import { renderFooter } from "../../shared/js/footer.js";
import { renderNavbar } from "../../shared/js/navbar.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { storage } from "../../shared/js/storage.js";
import { seedUsers } from "../../shared/js/user-seed.js";
import {
  showError,
  showValid,
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirm
} from "../../shared/js/auth-validation.js";
renderNavbar();
renderFooter();
seedUsers();

function checkAuthenticationAndRedirect() {
    const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

    if (!currentUser || (Array.isArray(currentUser) && currentUser.length === 0)) {
        return;
    }

    if (currentUser && currentUser.role) {
        switch (currentUser.role) {
            case "admin":
                window.location.href = "../admin/panel.html";
                break;
            case "seller":
                window.location.href = "../seller/dashboard.html";
                break;
            case "customer":
                window.location.href = "../products/products-list.html";
                break;
            default:

                storage.remove(STORAGE_KEYS.CURRENT_USER);
        }
    }
}

checkAuthenticationAndRedirect();

/* ---------------- Register ---------------- */

function initRegister() {

    const form = document.getElementById("registerForm");
    if (!form) return;

    const usernameInput = document.getElementById("regUsername");
    const emailInput = document.getElementById("regEmail");
    const passwordInput = document.getElementById("regPassword");
    const confirmInput = document.getElementById("regConfirmPassword");

    const usernameError = document.getElementById("regUsernameError");
    const emailError = document.getElementById("regEmailError");
    const passwordError = document.getElementById("regPasswordError");
    const confirmError = document.getElementById("regConfirmPasswordError");
    const generalError = document.getElementById("regGeneralError");

    /* realtime validation */

    usernameInput.addEventListener("input", () => {

        const err = validateUsername(usernameInput.value);

        if (err) {
            showError(usernameInput, usernameError, err);
        } else {
            showValid(usernameInput, usernameError);
        }

    });

    emailInput.addEventListener("input", () => {

        const err = validateEmail(emailInput.value);

        if (err) {
            showError(emailInput, emailError, err);
        } else {
            showValid(emailInput, emailError);
        }

    });

    passwordInput.addEventListener("input", () => {

        const err = validatePassword(passwordInput.value);

        if (err) {
            showError(passwordInput, passwordError, err);
        } else {
            showValid(passwordInput, passwordError);
        }

    });

    confirmInput.addEventListener("input", () => {

        const err = validateConfirm(passwordInput.value, confirmInput.value);

        if (err) {
            showError(confirmInput, confirmError, err);
        } else {
            showValid(confirmInput, confirmError);
        }

    });

    /* submit */

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirm = confirmInput.value;

        let isValid = true;

        /* username */

        const usernameErr = validateUsername(username);

        if (usernameErr) {
            showError(usernameInput, usernameError, usernameErr);
            isValid = false;
        } else {
            showValid(usernameInput, usernameError);
        }

        /* email */

        const emailErr = validateEmail(email);

        if (emailErr) {
            showError(emailInput, emailError, emailErr);
            isValid = false;
        } else {
            showValid(emailInput, emailError);
        }

        /* password */

        const passwordErr = validatePassword(password);

        if (passwordErr) {
            showError(passwordInput, passwordError, passwordErr);
            isValid = false;
        } else {
            showValid(passwordInput, passwordError);
        }

        /* confirm */

        const confirmErr = validateConfirm(password, confirm);

        if (confirmErr) {
            showError(confirmInput, confirmError, confirmErr);
            isValid = false;
        } else {
            showValid(confirmInput, confirmError);
        }

        /* stop register if invalid */

        if (!isValid) return;

        /* continue register */

        const users = storage.get(STORAGE_KEYS.USERS);

        const usernameExists = users.find(
            u => u.username.toLowerCase() === username.toLowerCase()
        );

        if (usernameExists) {
            showError(usernameInput, usernameError, "This username is already taken.");
            return;
        }

        const emailExists = users.find(
            u => u.email.toLowerCase() === email.toLowerCase()
        );

        if (emailExists) {
            showError(emailInput, emailError, "An account with this email already exists.");
            return;
        }

        const newUser = {
            id: Date.now(),
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            password: password,
            role: "customer",
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        storage.set(STORAGE_KEYS.USERS, users);

        form.reset();

        Swal.fire({
            icon: "success",
            title: "Account Created!",
            text: "Your account created successfully",
            confirmButtonText: "Go to Login"
        }).then(() => {
            window.location.href = "login.html";
        });

    });

}

/* ---------------- Login ---------------- */

function initLogin() {

    const form = document.getElementById("loginForm");
    if (!form) return;

    const identifierInput = document.getElementById("loginIdentifier");
    const passwordInput = document.getElementById("loginPassword");

    const identifierError = document.getElementById("loginIdentifierError");
    const passwordError = document.getElementById("loginPasswordError");

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const identifier = identifierInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        let isValid = true;

        /* identifier validation */

        if (!identifier) {

            showError(
                identifierInput,
                identifierError,
                "Email or username is required"
            );

            isValid = false;

        } else {

            identifierInput.classList.remove("is-invalid");
            identifierError.textContent = "";
            identifierError.classList.add("d-none");

        }

        /* password validation */

        if (!password) {

            showError(
                passwordInput,
                passwordError,
                "Password is required"
            );

            isValid = false;

        } else {

            passwordInput.classList.remove("is-invalid");
            passwordError.textContent = "";
            passwordError.classList.add("d-none");

        }

        if (!isValid) return;

        /* check user */

        const users = storage.get(STORAGE_KEYS.USERS) || [];

        const userByIdentifier = users.find(
            u => u.email === identifier || u.username === identifier
        );

        /* ❌ no account found */

        if (!userByIdentifier) {

            showError(
                identifierInput,
                identifierError,
                "No account found with this email or username."
            );

            return;

        }

        /* 🚫 banned check */
        if (userByIdentifier.banned === true) {

            Swal.fire({
                icon: "error",
                title: "Account Banned",
                text: "Your account has been banned. Contact an administrator."
            });

            return;

        }

        /* ❌ wrong password */

        if (userByIdentifier.password !== password) {

            showError(
                passwordInput,
                passwordError,
                "Incorrect password. Please try again."
            );

            return;

        }

        const user = userByIdentifier;

        /* ✅ login success */

        const sessionUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };

        storage.set(STORAGE_KEYS.CURRENT_USER, sessionUser);



        if (user.role === "admin") {
            window.location.href = "../admin/panel.html";
        }
        else if (user.role === "seller") {
            window.location.href = "../seller/dashboard.html";
        }
        else {
            window.location.href = "../products/products-list.html";
        }



    });

}


const togglePassword = document.getElementById("togglePassword");

if (togglePassword) {

    togglePassword.addEventListener("click", () => {

        const passwordInput = document.getElementById("regPassword");
        const icon = togglePassword.querySelector("i");

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");

        } else {

            passwordInput.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");

        }

    });

}

const toggleLoginPassword = document.getElementById("toggleLoginPassword");

if (toggleLoginPassword) {

    toggleLoginPassword.addEventListener("click", () => {

        const input = document.getElementById("loginPassword");
        const icon = toggleLoginPassword.querySelector("i");

        if (input.type === "password") {

            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");

        } else {

            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");

        }

    });

}

/* ---------------- Init ---------------- */

initRegister();
initLogin();