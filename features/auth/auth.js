import { renderFooter } from "../../shared/js/footer.js";
import { renderNavbar } from "../../shared/js/navbar.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { storage } from "../../shared/js/storage.js";
import { seedUsers } from "../../shared/js/user-seed.js";

renderNavbar();
renderFooter();
seedUsers(); 

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

function validateUsername(username) {
    if (!username || username.trim() === "") {
        return "Username is required.";
    }
    if (username.trim().length < 3) {
        return "Username must be at least 3 characters long.";
    }
    if (username.trim().length > 20) {
        return "Username must not exceed 20 characters.";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
        return "Username can only contain letters, numbers, and underscores.";
    }
    return null;
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
            "regUsernameError",
            "regEmailError",
            "regPasswordError",
            "regConfirmPasswordError",
            "regGeneralError",
            "regSuccessMsg",
        ];
        hideAllErrors(...errorIds);

        const username = document.getElementById("regUsername").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("regConfirmPassword").value;

        let isValid = true;

        const usernameError = validateUsername(username);
        if (usernameError) {
            showError("regUsernameError", usernameError);
            isValid = false;
        }

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

        const existingUsername = users.find(
            (user) => user.username.toLowerCase() === username.trim().toLowerCase()
        );
        if (existingUsername) {
            showError("regGeneralError", "This username is already taken.");
            return;
        }

        const existingEmail = users.find(
            (user) => user.email.toLowerCase() === email.trim().toLowerCase()
        );
        if (existingEmail) {
            showError("regGeneralError", "An account with this email already exists.");
            return;
        }

        const newUser = {
            id: Date.now(),
            username: username.trim().toLowerCase(),
            email: email.trim().toLowerCase(),
            password: password,
            role: "customer",
            createdAt: new Date().toISOString(),
        };

        users.push(newUser);
        storage.set(STORAGE_KEYS.USERS, users);

        form.reset();

        Swal.fire({
            icon: "success",
            title: "Account Created!",
            text: "Your account has been created successfully.",
            confirmButtonText: "Go to Login",
            allowOutsideClick: false,
        }).then(() => {
            window.location.href = "login.html";
        });
    });
}

function initLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const rememberedIdentifier = storage.get(STORAGE_KEYS.REMEMBERED_IDENTIFIER);
    const identifierInput = document.getElementById("loginIdentifier");
    const rememberMeCheckbox = document.getElementById("rememberMe");

    if (rememberedIdentifier && rememberedIdentifier.length > 0) {
        identifierInput.value = rememberedIdentifier;
        rememberMeCheckbox.checked = true;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const errorIds = ["loginIdentifierError", "loginPasswordError", "loginGeneralError"];
        hideAllErrors(...errorIds);

        const identifier = document.getElementById("loginIdentifier").value;
        const password = document.getElementById("loginPassword").value;

        let isValid = true;

        if (!identifier || identifier.trim() === "") {
            showError("loginIdentifierError", "Email or username is required.");
            isValid = false;
        } else {
            const isEmail = identifier.includes("@");
            if (isEmail) {
                const emailError = validateEmail(identifier);
                if (emailError) {
                    showError("loginIdentifierError", emailError);
                    isValid = false;
                }
            } else {
                const usernameError = validateUsername(identifier);
                if (usernameError) {
                    showError("loginIdentifierError", usernameError);
                    isValid = false;
                }
            }
        }

        if (!password || password === "") {
            showError("loginPasswordError", "Password is required.");
            isValid = false;
        }

        if (!isValid) return;

        const users = storage.get(STORAGE_KEYS.USERS);
        const trimmedIdentifier = identifier.trim().toLowerCase();
        const user = users.find(
            (u) =>
                (u.email.toLowerCase() === trimmedIdentifier ||
                    u.username.toLowerCase() === trimmedIdentifier) &&
                u.password === password
        );

        if (!user) {
            showError("loginGeneralError", "Invalid email/username or password.");
            return;
        }

        const rememberMe = document.getElementById("rememberMe").checked;
        if (rememberMe) {
            storage.set(STORAGE_KEYS.REMEMBERED_IDENTIFIER, trimmedIdentifier);
        } else {
            storage.remove(STORAGE_KEYS.REMEMBERED_IDENTIFIER);
        }

        const sessionUser = {
            id: user.id,
            username: user.username,
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
            case "customer":
                window.location.href = "../products/products-list.html";
                break;
            default:
                window.location.href = "../../index.html";
                break;
        }
    });
}

initRegister();
initLogin();