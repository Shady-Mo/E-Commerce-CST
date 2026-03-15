export function showError(input, errorEl, message) {
  input.classList.add("is-invalid");
  input.classList.remove("is-valid");

  errorEl.textContent = message;
  errorEl.classList.remove("d-none");
}

export function showValid(input, errorEl) {
  input.classList.remove("is-invalid");
  input.classList.add("is-valid");

  errorEl.textContent = "";
  errorEl.classList.add("d-none");
}

export function validateUsername(username) {
  if (!username || username.trim() === "") {
    return "Username is required.";
  }

  if (username.length < 3) {
    return "Username must be at least 3 characters.";
  }

  if (username.length > 20) {
    return "Username must not exceed 20 characters.";
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Only letters, numbers and underscore allowed.";
  }

  return null;
}

export function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email) {
    return "Email is required.";
  }

  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }

  return null;
}

export function validatePassword(password) {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain number.";
  }

  return null;
}

export function validateConfirm(password, confirm) {
  if (!confirm) {
    return "Please confirm password.";
  }

  if (password !== confirm) {
    return "Passwords do not match.";
  }

  return null;
}