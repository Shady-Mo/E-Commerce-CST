import { renderNavbar } from "../../shared/js/navbar.js";
import { renderFooter } from "../../shared/js/footer.js";
import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";

renderNavbar();
renderFooter();

function showError(elementId, message) {
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

function hideAllErrors(...ids) {
    ids.forEach((id) => hideError(id));
}

function validateEmail(email) {
    if (!email || email.trim() === "") {
        return "Email is required.";
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
        return "Please enter a valid email address.";
    }
    return null;
}

function validatePassword(password) {
    if (!password || password === "") {
        return "Password is required.";
    }
    if (password.length < 8) {
        return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
        return "Password must contain at least one uppercase letter.";
    }
    if (!/[a-z]/.test(password)) {
        return "Password must contain at least one lowercase letter.";
    }
    if (!/[0-9]/.test(password)) {
        return "Password must contain at least one number.";
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return "Password must contain at least one special character.";
    }
    return null;
}

function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword || confirmPassword === "") {
        return "Please confirm your password.";
    }
    if (password !== confirmPassword) {
        return "Passwords do not match.";
    }
    return null;
}

function initRegister() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const errorIds = [
            "regEmailError",
            "regPasswordError",
            "regConfirmPasswordError",
            "regGeneralError",
            "regSuccessMsg",
        ];
        hideAllErrors(...errorIds);

        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("regConfirmPassword").value;

        let isValid = true;

        const emailError = validateEmail(email);
        if (emailError) {
            showError("regEmailError", emailError);
            isValid = false;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            showError("regPasswordError", passwordError);
            isValid = false;
        }

        const confirmError = validateConfirmPassword(password, confirmPassword);
        if (confirmError) {
            showError("regConfirmPasswordError", confirmError);
            isValid = false;
        }

        if (!isValid) return;

        const users = storage.get(STORAGE_KEYS.USERS);
        const existingUser = users.find(
            (user) => user.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (existingUser) {
            showError("regGeneralError", "An account with this email already exists.");
            return;
        }

        const newUser = {
            id: Date.now(),
            email: email.trim().toLowerCase(),
            password: password,
            role: "customer",
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        storage.set(STORAGE_KEYS.USERS, users);

        const successMsg = document.getElementById("regSuccessMsg");
        successMsg.textContent = "Account created successfully! Redirecting to login...";
        successMsg.classList.remove("d-none");

        form.reset();

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    });
}

function initLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const rememberedEmail = storage.get(STORAGE_KEYS.REMEMBERED_EMAIL);
    const emailInput = document.getElementById("loginEmail");
    const rememberMeCheckbox = document.getElementById("rememberMe");

    if (rememberedEmail && rememberedEmail.length > 0) {
        emailInput.value = rememberedEmail;
        rememberMeCheckbox.checked = true;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const errorIds = ["loginEmailError", "loginPasswordError", "loginGeneralError"];
        hideAllErrors(...errorIds);

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        let isValid = true;

        const emailError = validateEmail(email);
        if (emailError) {
            showError("loginEmailError", emailError);
            isValid = false;
        }

        if (!password || password === "") {
            showError("loginPasswordError", "Password is required.");
            isValid = false;
        }

        if (!isValid) return;

        const users = storage.get(STORAGE_KEYS.USERS);
        const user = users.find(
            (u) =>
                u.email.toLowerCase() === email.trim().toLowerCase() &&
                u.password === password
        );

        if (!user) {
            showError("loginGeneralError", "Invalid email or password.");
            return;
        }

        const rememberMe = document.getElementById("rememberMe").checked;
        if (rememberMe) {
            storage.set(STORAGE_KEYS.REMEMBERED_EMAIL, email.trim().toLowerCase());
        } else {
            storage.remove(STORAGE_KEYS.REMEMBERED_EMAIL);
        }

        const sessionUser = {
            id: user.id,
            email: user.email,
            role: user.role,
        };
        storage.set(STORAGE_KEYS.CURRENT_USER, sessionUser);

        switch (user.role) {
            case "admin":
                window.location.href = "../admin/panel.html";
                break;
            case "seller":
                window.location.href = "../seller/dashboard.html";
                break;
            default:
                window.location.href = "../../index.html";
                break;
        }
    });
}

initRegister();
initLogin();