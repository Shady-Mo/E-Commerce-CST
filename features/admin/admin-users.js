import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { showError, hideAllErrors, showConfirm } from "./admin.js";

/* ---------- Validation ---------- */

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

/* ---------- State ---------- */

let userFilter = '';
let userPage = 1;
let userPageSize = 10;

/* ---------- Create User ---------- */

export function initUserCreation() {
    const form = document.getElementById("createUserForm");
    if (!form) return;

    function handleSubmit(e) {
        e.preventDefault();
        console.log('createUserForm submitted');
        try {
            const errorIds = [
                "adminUsernameError",
                "adminEmailError",
                "adminPasswordError",
                "adminConfirmPasswordError",
                "adminGeneralError",
                "adminSuccessMsg",
            ];
            hideAllErrors(...errorIds);

            const username = document.getElementById("adminUsername").value;
            const email = document.getElementById("adminEmail").value;
            const password = document.getElementById("adminPassword").value;
            const confirmPassword = document.getElementById("adminConfirmPassword").value;
            const role = document.getElementById("adminRole").value || "customer";

            let isValid = true;

            const usernameError = validateUsername(username);
            if (usernameError) {
                showError("adminUsernameError", usernameError);
                isValid = false;
            }

            const emailError = validateEmail(email);
            if (emailError) {
                showError("adminEmailError", emailError);
                isValid = false;
            }

            const passwordError = validatePassword(password);
            if (passwordError) {
                showError("adminPasswordError", passwordError);
                isValid = false;
            }

            const confirmError = validateConfirmPassword(password, confirmPassword);
            if (confirmError) {
                showError("adminConfirmPasswordError", confirmError);
                isValid = false;
            }

            if (!isValid) return;

            const users = storage.get(STORAGE_KEYS.USERS);

            const existingUsername = users.find(
                (user) => user.username.toLowerCase() === username.trim().toLowerCase()
            );
            if (existingUsername) {
                showError("adminGeneralError", "This username is already taken.");
                return;
            }

            const existingEmail = users.find(
                (user) => user.email.toLowerCase() === email.trim().toLowerCase()
            );
            if (existingEmail) {
                showError("adminGeneralError", "An account with this email already exists.");
                return;
            }

            const newUser = {
                id: Date.now(),
                username: username.trim().toLowerCase(),
                email: email.trim().toLowerCase(),
                password: password,
                role: role,
                createdAt: new Date().toISOString(),
            };

            users.push(newUser);
            storage.set(STORAGE_KEYS.USERS, users);

            form.reset();
            showError("adminSuccessMsg", "New user account created successfully.");
            document.getElementById("adminSuccessMsg").classList.remove("d-none");
            renderUsers();
        } catch (err) {
            console.error('error in createUserForm submit', err);
            showError("adminGeneralError", "Unexpected error. See console.");
        }
    }

    form.addEventListener("submit", handleSubmit);
}

/* ---------- Render Users ---------- */

export function renderUsers() {
    const container = document.getElementById("usersListContainer");
    if (!container) return;

    const users = storage.get(STORAGE_KEYS.USERS) || [];
    if (users.length === 0) {
        container.innerHTML = '<p class="text-muted">No users found.</p>';
        return;
    }

    const filtered = users.filter(u =>
        u.username.toLowerCase().includes(userFilter) ||
        u.email.toLowerCase().includes(userFilter)
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / userPageSize));
    if (userPage > totalPages) userPage = totalPages;
    const startIndex = (userPage - 1) * userPageSize;
    const pageUsers = filtered.slice(startIndex, startIndex + userPageSize);

    let html = `
        <div class="table-responsive">
        <table class="table table-sm table-striped text-center">
            <thead>
                <tr>
                    <th class="col-id">ID</th>
                    <th>Username</th>
                    <th class="col-email">Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    pageUsers.forEach((u) => {
        const roleBadgeClass = u.role === 'admin' ? 'role-admin' : u.role === 'seller' ? 'role-seller' : 'role-customer';
        const isBanned = u.banned === true;
        html += `
            <tr data-user-id="${u.id}" ${isBanned ? 'class="table-danger"' : ''}>
                <td class="col-id">${u.id}</td>
                <td><strong>${u.username}</strong>${isBanned ? ' <span class="badge bg-danger ms-1"><i class="fas fa-ban me-1"></i>Banned</span>' : ''}</td>
                <td class="col-email">${u.email}</td>
                <td><span class="role-badge ${roleBadgeClass}">${u.role}</span></td>
                <td>
                    <div class="dropdown action-dropdown">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-ellipsis-v me-1"></i><span class="action-text"> Actions</span>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item text-primary change-role" href="#" data-role="admin"><i class="fas fa-user-shield"></i> Make Admin</a></li>
                            <li><a class="dropdown-item text-success change-role" href="#" data-role="seller"><i class="fas fa-store"></i> Make Seller</a></li>
                            <li><a class="dropdown-item text-secondary change-role" href="#" data-role="customer"><i class="fas fa-user"></i> Make Customer</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item ${isBanned ? 'text-success' : 'text-warning'} toggle-ban" href="#"><i class="fas fa-${isBanned ? 'unlock' : 'ban'}"></i> ${isBanned ? 'Unban User' : 'Ban User'}</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-info edit-user" href="#"><i class="fas fa-pen-to-square"></i> Edit User</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger delete-user" href="#"><i class="fas fa-trash-can"></i> Delete User</a></li>
                        </ul>
                    </div>
                </td>
            </tr>
        `;
    });

    html += `</tbody></table>`;

    html += '<nav><ul class="pagination justify-content-center">';
    for (let p = 1; p <= totalPages; p++) {
        html += `<li class="page-item ${p === userPage ? 'active' : ''}" style="position: relative; top: 10px;"><a class="page-link" href="#" data-page="${p}">${p}</a></li>`;
    }
    html += '</ul></nav>';

    container.innerHTML = html;

    container.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const p = Number(e.target.getAttribute('data-page'));
            if (!isNaN(p)) {
                userPage = p;
                renderUsers();
            }
        });
    });

    container.querySelectorAll('.change-role').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tr = e.target.closest('tr');
            const id = Number(tr.getAttribute('data-user-id'));
            const newRole = e.target.closest('.change-role').getAttribute('data-role');
            const all = storage.get(STORAGE_KEYS.USERS);
            const idx = all.findIndex(x => x.id === id);
            if (idx === -1) return;
            const adminsCount = all.filter(u => u.role === 'admin').length;
            if (all[idx].role === 'admin' && newRole !== 'admin' && adminsCount <= 1) {
                alert('Cannot remove the last administrator.');
                return;
            }
            showConfirm(`Change role of ${all[idx].username} to ${newRole}?`, () => {
                all[idx].role = newRole;
                storage.set(STORAGE_KEYS.USERS, all);
                renderUsers();
            });
        });
    });

    container.querySelectorAll('.edit-user').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tr = e.target.closest('tr');
            const id = Number(tr.getAttribute('data-user-id'));
            openEditUserModal(id);
        });
    });

    container.querySelectorAll('.toggle-ban').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tr = e.target.closest('tr');
            const id = Number(tr.getAttribute('data-user-id'));
            const all = storage.get(STORAGE_KEYS.USERS);
            const idx = all.findIndex(x => x.id === id);
            if (idx === -1) return;

            const current = storage.get(STORAGE_KEYS.CURRENT_USER);
            if (current && current.id === id) {
                alert('You cannot ban your own account.');
                return;
            }

            if (all[idx].role === 'admin') {
                alert('Cannot ban an administrator.');
                return;
            }

            const isBanned = all[idx].banned === true;
            const action = isBanned ? 'Unban' : 'Ban';
            showConfirm(`${action} user ${all[idx].username}?`, () => {
                all[idx].banned = !isBanned;
                storage.set(STORAGE_KEYS.USERS, all);
                renderUsers();
            });
        });
    });

    container.querySelectorAll('.delete-user').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tr = e.target.closest('tr');
            const id = Number(tr.getAttribute('data-user-id'));
            const all = storage.get(STORAGE_KEYS.USERS);
            const user = all.find(x => x.id === id);
            if (!user) return;

            const current = storage.get(STORAGE_KEYS.CURRENT_USER);
            if (current && current.id === id) {
                alert('You cannot delete your own account while logged in.');
                return;
            }

            if (user.role === 'admin') {
                const adminsCount = all.filter(u => u.role === 'admin').length;
                if (adminsCount <= 1) {
                    alert('Cannot delete the last administrator.');
                    return;
                }
            }

            showConfirm(`Delete user ${user.username}?`, () => {
                let remaining = all.filter(x => x.id !== id);
                storage.set(STORAGE_KEYS.USERS, remaining);
                renderUsers();
            });
        });
    });
}

/* ---------- Edit User Modal ---------- */

function openEditUserModal(id) {
    const all = storage.get(STORAGE_KEYS.USERS) || [];
    const user = all.find(u => u.id === id);
    if (!user) return;

    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUsername').value = user.username;
    document.getElementById('editEmail').value = user.email;
    document.getElementById('editRole').value = user.role || 'customer';
    document.getElementById('editPassword').value = '';

    hideAllErrors('editUsernameError', 'editEmailError', 'editPasswordError', 'editGeneralError');

    const modalEl = document.getElementById('editUserModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

export function initEditUserForm() {
    const btn = document.getElementById('saveEditUserBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const id = Number(document.getElementById('editUserId').value);
        const username = document.getElementById('editUsername').value;
        const email = document.getElementById('editEmail').value;
        const role = document.getElementById('editRole').value;
        const password = document.getElementById('editPassword').value;

        hideAllErrors('editUsernameError', 'editEmailError', 'editPasswordError', 'editGeneralError');

        let isValid = true;
        const usernameError = validateUsername(username);
        if (usernameError) { showError('editUsernameError', usernameError); isValid = false; }
        const emailError = validateEmail(email);
        if (emailError) { showError('editEmailError', emailError); isValid = false; }
        if (password && password.length > 0) {
            const passwordError = validatePassword(password);
            if (passwordError) { showError('editPasswordError', passwordError); isValid = false; }
        }
        if (!isValid) return;

        const all = storage.get(STORAGE_KEYS.USERS) || [];
        const idx = all.findIndex(u => u.id === id);
        if (idx === -1) return;

        const otherWithUsername = all.find(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.id !== id);
        if (otherWithUsername) { showError('editGeneralError', 'Username already taken'); return; }
        const otherWithEmail = all.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== id);
        if (otherWithEmail) { showError('editGeneralError', 'Email already used'); return; }

        const adminsCount = all.filter(u => u.role === 'admin').length;
        if (all[idx].role === 'admin' && role !== 'admin' && adminsCount <= 1) {
            alert('Cannot remove the last administrator.');
            return;
        }

        all[idx].username = username.trim().toLowerCase();
        all[idx].email = email.trim().toLowerCase();
        all[idx].role = role;
        if (password && password.length > 0) all[idx].password = password;

        storage.set(STORAGE_KEYS.USERS, all);
        renderUsers();

        const modalEl = document.getElementById('editUserModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
    });
}

/* ---------- Search & Pagination Bindings ---------- */

export function initUserSearch() {
    const searchEl = document.getElementById('userSearch');
    const sizeEl = document.getElementById('userPageSize');

    if (searchEl) {
        searchEl.addEventListener('input', e => {
            userFilter = e.target.value.toLowerCase();
            userPage = 1;
            renderUsers();
        });
    }
    if (sizeEl) {
        sizeEl.addEventListener('change', e => {
            userPageSize = Number(e.target.value) || 10;
            userPage = 1;
            renderUsers();
        });
    }
}
