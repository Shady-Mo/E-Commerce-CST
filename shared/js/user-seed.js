import { STORAGE_KEYS } from "./storage-keys.js";
import { storage } from "./storage.js";
import { User } from "./User.js";

export function seedUsers() {
    const existingUsers = storage.get(STORAGE_KEYS.USERS);
    if (existingUsers.length > 0) return;

    const adminUser = new User({
        id: 2001,
        username: "admin",
        email: "admin@example.com",
        password: "Admin@123",
        role: "admin"
    });

    const seller1 = new User({
        id: 2002,
        username: "seller1",
        email: "seller1@example.com",
        password: "Seller@123",
        role: "seller"
    });

    const seller2 = new User({
        id: 2003,
        username: "seller2",
        email: "seller2@example.com",
        password: "Seller@123",
        role: "seller"
    });

    const customer = new User({
        id: 2004,
        username: "customer",
        email: "customer@example.com",
        password: "Customer@123",
        role: "customer"
    });

    const users = [
        adminUser.toJSON(),
        seller1.toJSON(),
        seller2.toJSON(),
        customer.toJSON()
    ];

    storage.set(STORAGE_KEYS.USERS, users);
}
