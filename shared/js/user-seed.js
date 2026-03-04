import { storage } from "./storage.js";
import { STORAGE_KEYS } from "./storage-keys.js";

export function seedUsers() {
    const existingUsers = storage.get(STORAGE_KEYS.USERS);
    if (existingUsers.length > 0) return;

    const users = [
        {
            id: Date.now(),
            username: "admin",
            email: "admin@example.com",
            password: "Admin@123",
            role: "admin",
            createdAt: new Date().toISOString(),
        },
    ];

    storage.set(STORAGE_KEYS.USERS, users);
}
