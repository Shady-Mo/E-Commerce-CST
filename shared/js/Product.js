export class Product {
    constructor({
        id = Date.now(),
        name = "",
        price = 0,
        oldPrice = null,
        rating = 0,
        category = "",
        badge = null,
        discount = 0,
        stock = 0,
        image = "",
        description = "",
        images = [],
        sellerId = null,
        reviews = [],
        createdAt = new Date().toISOString(),
        updatedAt = new Date().toISOString()
    } = {}) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.oldPrice = oldPrice;
        this.rating = rating;
        this.category = category;
        this.badge = badge;
        this.discount = discount;
        this.stock = stock;
        this.image = image;
        this.description = description;
        this.images = images;
        this.sellerId = sellerId;
        this.reviews = reviews;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    validate() {
        const errors = [];

        if (!this.name || this.name.trim() === "") {
            errors.push("Product name is required");
        }

        if (this.price <= 0) {
            errors.push("Price must be greater than 0");
        }

        if (this.stock < 0) {
            errors.push("Stock cannot be negative");
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    updateTimestamp() {
        this.updatedAt = new Date().toISOString();
    }

    getFinalPrice() {
        if (this.discount > 0) {
            return this.price - (this.price * this.discount / 100);
        }
        return this.price;
    }

    isAvailable() {
        return this.stock > 0;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            oldPrice: this.oldPrice,
            rating: this.rating,
            category: this.category,
            badge: this.badge,
            discount: this.discount,
            stock: this.stock,
            image: this.image,
            description: this.description,
            images: this.images,
            sellerId: this.sellerId,
            reviews: this.reviews,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}