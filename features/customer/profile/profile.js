import { storage } from "../../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../../shared/js/storage-keys.js";
import {
  showError,
  showValid,
  validateUsername,
  validateEmail,
  validatePassword,
  validateConfirm
} from "../../../shared/js/auth-validation.js";
import { renderFooter } from "../../../shared/js/footer.js";
import { renderNavbar } from "../../../shared/js/navbar.js";
renderNavbar();
renderFooter();
function initProfileForm() {
  const form = document.getElementById("profileForm");
  if (!form) return;

  const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);
  const users = storage.get(STORAGE_KEYS.USERS) || [];

  if (!currentUser) return;

  const usernameInput = document.getElementById("profileUsername");
  const emailInput = document.getElementById("profileEmail");
  const passwordInput = document.getElementById("profilePassword");
  const confirmInput = document.getElementById("profileConfirmPassword");

  const usernameError = document.getElementById("profileUsernameError");
  const emailError = document.getElementById("profileEmailError");
  const passwordError = document.getElementById("profilePasswordError");
  const confirmError = document.getElementById("profileConfirmPasswordError");

  const user = users.find(u => u.id === currentUser.id);
  if (!user) return;

  usernameInput.value = user.username || "";
  emailInput.value = user.email || "";

  usernameInput.addEventListener("input", () => {
    const err = validateUsername(usernameInput.value.trim());
    err ? showError(usernameInput, usernameError, err) : showValid(usernameInput, usernameError);
  });

  emailInput.addEventListener("input", () => {
    const err = validateEmail(emailInput.value.trim());
    err ? showError(emailInput, emailError, err) : showValid(emailInput, emailError);
  });

  if (passwordInput) {
    passwordInput.addEventListener("input", () => {
      if (!passwordInput.value) {
        passwordInput.classList.remove("is-invalid", "is-valid");
        passwordError.textContent = "";
        passwordError.classList.add("d-none");
        return;
      }

      const err = validatePassword(passwordInput.value);
      err ? showError(passwordInput, passwordError, err) : showValid(passwordInput, passwordError);
    });
  }

  if (confirmInput) {
    confirmInput.addEventListener("input", () => {
      if (!passwordInput.value && !confirmInput.value) {
        confirmInput.classList.remove("is-invalid", "is-valid");
        confirmError.textContent = "";
        confirmError.classList.add("d-none");
        return;
      }

      const err = validateConfirm(passwordInput.value, confirmInput.value);
      err ? showError(confirmInput, confirmError, err) : showValid(confirmInput, confirmError);
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput ? passwordInput.value : "";
    const confirm = confirmInput ? confirmInput.value : "";

    let isValid = true;

    const usernameErr = validateUsername(username);
    if (usernameErr) {
      showError(usernameInput, usernameError, usernameErr);
      isValid = false;
    } else {
      showValid(usernameInput, usernameError);
    }

    const emailErr = validateEmail(email);
    if (emailErr) {
      showError(emailInput, emailError, emailErr);
      isValid = false;
    } else {
      showValid(emailInput, emailError);
    }

    if (password || confirm) {
  const passwordErr = validatePassword(password);
  if (passwordErr) {
    showError(passwordInput, passwordError, passwordErr);
    isValid = false;
  } else {
    showValid(passwordInput, passwordError);
  }

  const confirmErr = validateConfirm(password, confirm);
  if (confirmErr) {
    showError(confirmInput, confirmError, confirmErr);
    isValid = false;
  } else {
    showValid(confirmInput, confirmError);
  }
}

    const usernameExists = users.find(
      u => u.id !== currentUser.id && u.username.toLowerCase() === username.toLowerCase()
    );

    if (usernameExists) {
      showError(usernameInput, usernameError, "This username is already taken.");
      isValid = false;
    }

    const emailExists = users.find(
      u => u.id !== currentUser.id && u.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      showError(emailInput, emailError, "An account with this email already exists.");
      isValid = false;
    }

    if (!isValid) return;

    user.username = username.toLowerCase();
    user.email = email.toLowerCase();

    if (password) {
      user.password = password;
    }

    storage.set(STORAGE_KEYS.USERS, users);

    storage.set(STORAGE_KEYS.CURRENT_USER, {
      ...currentUser,
      username: user.username,
      email: user.email
    });

    Swal.fire({
      icon: "success",
      title: "Profile Updated",
      text: "Your profile has been updated successfully."
    });
  });
}

const toggleProfilePassword = document.getElementById("toggleProfilePassword");

if (toggleProfilePassword) {
  toggleProfilePassword.addEventListener("click", () => {
    const input = document.getElementById("profilePassword");
    const icon = toggleProfilePassword.querySelector("i");

    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
}

const toggleProfileConfirmPassword = document.getElementById("toggleProfileConfirmPassword");

if (toggleProfileConfirmPassword) {
  toggleProfileConfirmPassword.addEventListener("click", () => {
    const input = document.getElementById("profileConfirmPassword");
    const icon = toggleProfileConfirmPassword.querySelector("i");

    if (input.type === "password") {
      input.type = "text";
      icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
      input.type = "password";
      icon.classList.replace("fa-eye-slash", "fa-eye");
    }
  });
}
initProfileForm();