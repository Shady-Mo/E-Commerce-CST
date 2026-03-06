export class User {
    constructor({
        id = Date.now(),
        username = "",
        email = "",
        password = "",
        role = "customer",
        createdAt = new Date().toISOString()
    } = {}) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = createdAt;
    }

    validate() {
        const errors = [];

        if (!this.username || this.username.trim() === "") {
            errors.push("Username is required");
        }

        if (this.username.length < 3) {
            errors.push("Username must be at least 3 characters");
        }

        if (!this.email || !this.isValidEmail(this.email)) {
            errors.push("Valid email is required");
        }

        if (!this.password || this.password.length < 8) {
            errors.push("Password must be at least 8 characters");
        }

        if (!["customer", "seller", "admin"].includes(this.role)) {
            errors.push("Invalid user role");
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isSeller() {
        return this.role === "seller";
    }

    isAdmin() {
        return this.role === "admin";
    }

    isCustomer() {
        return this.role === "customer";
    }

    toSafeObject() {
        const { password, ...safeUser } = this;
        return safeUser;
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            password: this.password,
            role: this.role,
            createdAt: this.createdAt
        };
    }
}
