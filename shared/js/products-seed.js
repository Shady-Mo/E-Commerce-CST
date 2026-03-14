import { Product } from "./Product.js";
import { STORAGE_KEYS } from "./storage-keys.js";
import { storage } from "./storage.js";

export function seedProducts() {
  const existingProducts = storage.get(STORAGE_KEYS.PRODUCTS);
  if (existingProducts && existingProducts.length > 0) return;

  const products = [
    new Product({
      id: 1,
      name: "White Ceramic Vase",
      price: 100,
      oldPrice: 120,
      rating: 4,
      category: "Accessories",
      badge: "New",
      discount: 20,
      stock: 12,
      image: "../../assets/images/1-600x800.jpg",
      description: "Cillum dolore lorem ipsum decoration item",
      images: [
        "../../assets/images/2-600x800.jpg",
        "../../assets/images/1-600x800.jpg",
        "../../assets/images/5_1-600x800.jpg",
        "../../assets/images/4-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 2,
      name: "Decor Round Pouf",
      price: 64,
      oldPrice: 78,
      rating: 4,
      category: "Decor",
      badge: "New",
      discount: 20,
      stock: 7,
      image: "../../assets/images/2-600x800.jpg",
      description: "Lorem ipsum cillium dolore decoration item",
      images: [
        "../../assets/images/4-600x800.jpg",
        "../../assets/images/6-600x800.jpg",
        "../../assets/images/1_1-600x800.jpg",
        "../../assets/images/5-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 3,
      name: "Modern Table Lamp",
      price: 180,
      oldPrice: 200,
      rating: 4,
      category: "Lighting",
      badge: "New",
      discount: 20,
      stock: 0,
      image: "../../assets/images/3-600x800.jpg",
      description: "Cillum dolore lorem ipsum decoration item",
      images: [
        "../../assets/images/10-600x800.jpg",
        "../../assets/images/9-600x800.jpg",
        "../../assets/images/8_1-600x800.jpg",
        "../../assets/images/7-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 4,
      name: "Luxury Wall Lamp",
      price: 122.75,
      oldPrice: 150,
      rating: 5,
      category: "Lighting",
      badge: "New",
      discount: 18,
      stock: 5,
      image: "../../assets/images/4-600x800.jpg",
      description: "Modern wall luxury lamp with golden finish",
      images: [
        "../../assets/images/7-600x800.jpg",
        "../../assets/images/6-600x800.jpg",
        "../../assets/images/8_1-600x800.jpg",
        "../../assets/images/9-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 5,
      name: "Minimal White Chair",
      price: 140.99,
      oldPrice: 170,
      rating: 4,
      category: "Furniture",
      badge: "New",
      discount: 17,
      stock: 3,
      image: "../../assets/images/5-600x800.jpg",
      description: "Elegant white minimal chair for modern homes",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/6-600x800.jpg"
      ],
      sellerId: 2003,
      reviews: []
    }).toJSON(),

    new Product({
      id: 6,
      name: "Modern Wooden Table",
      price: 122.75,
      oldPrice: 150,
      rating: 4,
      category: "Furniture",
      badge: "New",
      discount: 18,
      stock: 0,
      image: "../../assets/images/6-600x800.jpg",
      description: "Stylish modern wooden log table",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/5-600x800.jpg"
      ],
      sellerId: 2003,
      reviews: []
    }).toJSON(),

    new Product({
      id: 7,
      name: "Luxury Sofa",
      price: 300,
      oldPrice: 350,
      rating: 5,
      category: "Furniture",
      badge: "New",
      discount: 14,
      stock: 4,
      image: "../../assets/images/7-600x800.jpg",
      description: "Comfortable modern luxury sofa",
      images: [
        "../../assets/images/1_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/10-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 8,
      name: "Art Head Vase",
      price: 122.75,
      oldPrice: 150,
      rating: 4,
      category: "Decor",
      badge: "New",
      discount: 18,
      stock: 0,
      image: "../../assets/images/9-600x800.jpg",
      description: "Artistic decorative head vase",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/1-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),
    new Product({
      id: 9,
      name: "White Ceramic Vase",
      price: 100,
      oldPrice: 120,
      rating: 4,
      category: "Accessories",
      badge: "New",
      discount: 20,
      stock: 12,
      image: "../../assets/images/1-600x800.jpg",
      description: "Cillum dolore lorem ipsum decoration item",
      images: [
        "../../assets/images/2-600x800.jpg",
        "../../assets/images/1-600x800.jpg",
        "../../assets/images/5_1-600x800.jpg",
        "../../assets/images/4-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 10,
      name: "Decor Round Pouf",
      price: 64,
      oldPrice: 78,
      rating: 4,
      category: "Decor",
      badge: "New",
      discount: 20,
      stock: 7,
      image: "../../assets/images/2-600x800.jpg",
      description: "Lorem ipsum cillium dolore decoration item",
      images: [
        "../../assets/images/4-600x800.jpg",
        "../../assets/images/6-600x800.jpg",
        "../../assets/images/1_1-600x800.jpg",
        "../../assets/images/5-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 11,
      name: "Modern Table Lamp",
      price: 180,
      oldPrice: 200,
      rating: 4,
      category: "Lighting",
      badge: "New",
      discount: 20,
      stock: 0,
      image: "../../assets/images/3-600x800.jpg",
      description: "Cillum dolore lorem ipsum decoration item",
      images: [
        "../../assets/images/10-600x800.jpg",
        "../../assets/images/9-600x800.jpg",
        "../../assets/images/8_1-600x800.jpg",
        "../../assets/images/7-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 12,
      name: "Luxury Wall Lamp",
      price: 122.75,
      oldPrice: 150,
      rating: 5,
      category: "Lighting",
      badge: "New",
      discount: 18,
      stock: 5,
      image: "../../assets/images/4-600x800.jpg",
      description: "Modern wall luxury lamp with golden finish",
      images: [
        "../../assets/images/7-600x800.jpg",
        "../../assets/images/6-600x800.jpg",
        "../../assets/images/8_1-600x800.jpg",
        "../../assets/images/9-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 13,
      name: "Minimal White Chair",
      price: 140.99,
      oldPrice: 170,
      rating: 4,
      category: "Furniture",
      badge: "New",
      discount: 17,
      stock: 3,
      image: "../../assets/images/5-600x800.jpg",
      description: "Elegant white minimal chair for modern homes",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/6-600x800.jpg"
      ],
      sellerId: 2003,
      reviews: []
    }).toJSON(),

    new Product({
      id: 14,
      name: "Modern Wooden Table",
      price: 122.75,
      oldPrice: 150,
      rating: 4,
      category: "Furniture",
      badge: "New",
      discount: 18,
      stock: 0,
      image: "../../assets/images/6-600x800.jpg",
      description: "Stylish modern wooden log table",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/5-600x800.jpg"
      ],
      sellerId: 2003,
      reviews: []
    }).toJSON(),

    new Product({
      id: 15,
      name: "Luxury Sofa",
      price: 300,
      oldPrice: 350,
      rating: 5,
      category: "Furniture",
      badge: "New",
      discount: 14,
      stock: 4,
      image: "../../assets/images/7-600x800.jpg",
      description: "Comfortable modern luxury sofa",
      images: [
        "../../assets/images/1_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/10-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 16,
      name: "Art Head Vase",
      price: 122.75,
      oldPrice: 150,
      rating: 4,
      category: "Decor",
      badge: "New",
      discount: 18,
      stock: 0,
      image: "../../assets/images/9-600x800.jpg",
      description: "Artistic decorative head vase",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/1-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),
    new Product({
      id: 17,
      name: "White Ceramic Vase",
      price: 100,
      oldPrice: 120,
      rating: 4,
      category: "Accessories",
      badge: "New",
      discount: 20,
      stock: 12,
      image: "../../assets/images/1-600x800.jpg",
      description: "Cillum dolore lorem ipsum decoration item",
      images: [
        "../../assets/images/2-600x800.jpg",
        "../../assets/images/1-600x800.jpg",
        "../../assets/images/5_1-600x800.jpg",
        "../../assets/images/4-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 18,
      name: "Decor Round Pouf",
      price: 64,
      oldPrice: 78,
      rating: 4,
      category: "Decor",
      badge: "New",
      discount: 20,
      stock: 7,
      image: "../../assets/images/2-600x800.jpg",
      description: "Lorem ipsum cillium dolore decoration item",
      images: [
        "../../assets/images/4-600x800.jpg",
        "../../assets/images/6-600x800.jpg",
        "../../assets/images/1_1-600x800.jpg",
        "../../assets/images/5-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 19,
      name: "Modern Table Lamp",
      price: 180,
      oldPrice: 200,
      rating: 4,
      category: "Lighting",
      badge: "New",
      discount: 20,
      stock: 0,
      image: "../../assets/images/3-600x800.jpg",
      description: "Cillum dolore lorem ipsum decoration item",
      images: [
        "../../assets/images/10-600x800.jpg",
        "../../assets/images/9-600x800.jpg",
        "../../assets/images/8_1-600x800.jpg",
        "../../assets/images/7-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 20,
      name: "Luxury Wall Lamp",
      price: 122.75,
      oldPrice: 150,
      rating: 5,
      category: "Lighting",
      badge: "New",
      discount: 18,
      stock: 5,
      image: "../../assets/images/4-600x800.jpg",
      description: "Modern wall luxury lamp with golden finish",
      images: [
        "../../assets/images/7-600x800.jpg",
        "../../assets/images/6-600x800.jpg",
        "../../assets/images/8_1-600x800.jpg",
        "../../assets/images/9-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 21,
      name: "Minimal White Chair",
      price: 140.99,
      oldPrice: 170,
      rating: 4,
      category: "Furniture",
      badge: "New",
      discount: 17,
      stock: 3,
      image: "../../assets/images/5-600x800.jpg",
      description: "Elegant white minimal chair for modern homes",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/6-600x800.jpg"
      ],
      sellerId: 2003,
      reviews: []
    }).toJSON(),

    new Product({
      id: 22,
      name: "Modern Wooden Table",
      price: 122.75,
      oldPrice: 150,
      rating: 4,
      category: "Furniture",
      badge: "New",
      discount: 18,
      stock: 0,
      image: "../../assets/images/6-600x800.jpg",
      description: "Stylish modern wooden log table",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/5-600x800.jpg"
      ],
      sellerId: 2003,
      reviews: []
    }).toJSON(),

    new Product({
      id: 23,
      name: "Luxury Sofa",
      price: 300,
      oldPrice: 350,
      rating: 5,
      category: "Furniture",
      badge: "New",
      discount: 14,
      stock: 4,
      image: "../../assets/images/7-600x800.jpg",
      description: "Comfortable modern luxury sofa",
      images: [
        "../../assets/images/1_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/10-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 24,
      name: "Art Head Vase",
      price: 122.75,
      oldPrice: 150,
      rating: 4,
      category: "Decor",
      badge: "New",
      discount: 18,
      stock: 0,
      image: "../../assets/images/9-600x800.jpg",
      description: "Artistic decorative head vase",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/1-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),
    new Product({
      id: 25,
      name: "White Ceramic Vase",
      price: 100,
      oldPrice: 120,
      rating: 4,
      category: "Accessories",
      badge: "New",
      discount: 20,
      stock: 12,
      image: "../../assets/images/1-600x800.jpg",
      description: "Cillum dolore lorem ipsum decoration item",
      images: [
        "../../assets/images/2-600x800.jpg",
        "../../assets/images/1-600x800.jpg",
        "../../assets/images/5_1-600x800.jpg",
        "../../assets/images/4-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 26,
      name: "Decor Round Pouf",
      price: 64,
      oldPrice: 78,
      rating: 4,
      category: "Decor",
      badge: "New",
      discount: 20,
      stock: 7,
      image: "../../assets/images/2-600x800.jpg",
      description: "Lorem ipsum cillium dolore decoration item",
      images: [
        "../../assets/images/4-600x800.jpg",
        "../../assets/images/6-600x800.jpg",
        "../../assets/images/1_1-600x800.jpg",
        "../../assets/images/5-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 27,
      name: "Modern Table Lamp",
      price: 180,
      oldPrice: 200,
      rating: 4,
      category: "Lighting",
      badge: "New",
      discount: 20,
      stock: 0,
      image: "../../assets/images/3-600x800.jpg",
      description: "Cillum dolore lorem ipsum decoration item",
      images: [
        "../../assets/images/10-600x800.jpg",
        "../../assets/images/9-600x800.jpg",
        "../../assets/images/8_1-600x800.jpg",
        "../../assets/images/7-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 28,
      name: "Luxury Wall Lamp",
      price: 122.75,
      oldPrice: 150,
      rating: 5,
      category: "Lighting",
      badge: "New",
      discount: 18,
      stock: 5,
      image: "../../assets/images/4-600x800.jpg",
      description: "Modern wall luxury lamp with golden finish",
      images: [
        "../../assets/images/7-600x800.jpg",
        "../../assets/images/6-600x800.jpg",
        "../../assets/images/8_1-600x800.jpg",
        "../../assets/images/9-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 29,
      name: "Minimal White Chair",
      price: 140.99,
      oldPrice: 170,
      rating: 4,
      category: "Furniture",
      badge: "New",
      discount: 17,
      stock: 3,
      image: "../../assets/images/5-600x800.jpg",
      description: "Elegant white minimal chair for modern homes",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/6-600x800.jpg"
      ],
      sellerId: 2003,
      reviews: []
    }).toJSON(),

    new Product({
      id: 30,
      name: "Modern Wooden Table",
      price: 122.75,
      oldPrice: 150,
      rating: 4,
      category: "Furniture",
      badge: "New",
      discount: 18,
      stock: 0,
      image: "../../assets/images/6-600x800.jpg",
      description: "Stylish modern wooden log table",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/5-600x800.jpg"
      ],
      sellerId: 2003,
      reviews: []
    }).toJSON(),

    new Product({
      id: 31,
      name: "Luxury Sofa",
      price: 300,
      oldPrice: 350,
      rating: 5,
      category: "Furniture",
      badge: "New",
      discount: 14,
      stock: 4,
      image: "../../assets/images/7-600x800.jpg",
      description: "Comfortable modern luxury sofa",
      images: [
        "../../assets/images/1_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/10-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 32,
      name: "Art Head Vase",
      price: 122.75,
      oldPrice: 150,
      rating: 4,
      category: "Decor",
      badge: "New",
      discount: 18,
      stock: 0,
      image: "../../assets/images/9-600x800.jpg",
      description: "Artistic decorative head vase",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/1-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),
    new Product({
      id: 33,
      name: "White Ceramic Vase",
      price: 100,
      oldPrice: 120,
      rating: 4,
      category: "Accessories",
      badge: "New",
      discount: 20,
      stock: 12,
      image: "../../assets/images/1-600x800.jpg",
      description: "Cillum dolore lorem ipsum decoration item",
      images: [
        "../../assets/images/2-600x800.jpg",
        "../../assets/images/1-600x800.jpg",
        "../../assets/images/5_1-600x800.jpg",
        "../../assets/images/4-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 34,
      name: "Decor Round Pouf",
      price: 64,
      oldPrice: 78,
      rating: 4,
      category: "Decor",
      badge: "New",
      discount: 20,
      stock: 7,
      image: "../../assets/images/2-600x800.jpg",
      description: "Lorem ipsum cillium dolore decoration item",
      images: [
        "../../assets/images/4-600x800.jpg",
        "../../assets/images/6-600x800.jpg",
        "../../assets/images/1_1-600x800.jpg",
        "../../assets/images/5-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 35,
      name: "Modern Table Lamp",
      price: 180,
      oldPrice: 200,
      rating: 4,
      category: "Lighting",
      badge: "New",
      discount: 20,
      stock: 0,
      image: "../../assets/images/3-600x800.jpg",
      description: "Cillum dolore lorem ipsum decoration item",
      images: [
        "../../assets/images/10-600x800.jpg",
        "../../assets/images/9-600x800.jpg",
        "../../assets/images/8_1-600x800.jpg",
        "../../assets/images/7-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 36,
      name: "Luxury Wall Lamp",
      price: 122.75,
      oldPrice: 150,
      rating: 5,
      category: "Lighting",
      badge: "New",
      discount: 18,
      stock: 5,
      image: "../../assets/images/4-600x800.jpg",
      description: "Modern wall luxury lamp with golden finish",
      images: [
        "../../assets/images/7-600x800.jpg",
        "../../assets/images/6-600x800.jpg",
        "../../assets/images/8_1-600x800.jpg",
        "../../assets/images/9-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 37,
      name: "Minimal White Chair",
      price: 140.99,
      oldPrice: 170,
      rating: 4,
      category: "Furniture",
      badge: "New",
      discount: 17,
      stock: 3,
      image: "../../assets/images/5-600x800.jpg",
      description: "Elegant white minimal chair for modern homes",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/6-600x800.jpg"
      ],
      sellerId: 2003,
      reviews: []
    }).toJSON(),

    new Product({
      id: 38,
      name: "Modern Wooden Table",
      price: 122.75,
      oldPrice: 150,
      rating: 4,
      category: "Furniture",
      badge: "New",
      discount: 18,
      stock: 0,
      image: "../../assets/images/6-600x800.jpg",
      description: "Stylish modern wooden log table",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/5-600x800.jpg"
      ],
      sellerId: 2003,
      reviews: []
    }).toJSON(),

    new Product({
      id: 39,
      name: "Luxury Sofa",
      price: 300,
      oldPrice: 350,
      rating: 5,
      category: "Furniture",
      badge: "New",
      discount: 14,
      stock: 4,
      image: "../../assets/images/7-600x800.jpg",
      description: "Comfortable modern luxury sofa",
      images: [
        "../../assets/images/1_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/10-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 40,
      name: "Art Head Vase",
      price: 122.75,
      oldPrice: 150,
      rating: 4,
      category: "Decor",
      badge: "New",
      discount: 18,
      stock: 0,
      image: "../../assets/images/9-600x800.jpg",
      description: "Artistic decorative head vase",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/1-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),
    new Product({
      id: 41,
      name: "White Ceramic Vase",
      price: 100,
      oldPrice: 120,
      rating: 4,
      category: "Accessories",
      badge: "New",
      discount: 20,
      stock: 12,
      image: "../../assets/images/1-600x800.jpg",
      description: "Cillum dolore lorem ipsum decoration item",
      images: [
        "../../assets/images/2-600x800.jpg",
        "../../assets/images/1-600x800.jpg",
        "../../assets/images/5_1-600x800.jpg",
        "../../assets/images/4-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 42,
      name: "Decor Round Pouf",
      price: 64,
      oldPrice: 78,
      rating: 4,
      category: "Decor",
      badge: "New",
      discount: 20,
      stock: 7,
      image: "../../assets/images/2-600x800.jpg",
      description: "Lorem ipsum cillium dolore decoration item",
      images: [
        "../../assets/images/4-600x800.jpg",
        "../../assets/images/6-600x800.jpg",
        "../../assets/images/1_1-600x800.jpg",
        "../../assets/images/5-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 43,
      name: "Modern Table Lamp",
      price: 180,
      oldPrice: 200,
      rating: 4,
      category: "Lighting",
      badge: "New",
      discount: 20,
      stock: 0,
      image: "../../assets/images/3-600x800.jpg",
      description: "Cillum dolore lorem ipsum decoration item",
      images: [
        "../../assets/images/10-600x800.jpg",
        "../../assets/images/9-600x800.jpg",
        "../../assets/images/8_1-600x800.jpg",
        "../../assets/images/7-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 44,
      name: "Luxury Wall Lamp",
      price: 122.75,
      oldPrice: 150,
      rating: 5,
      category: "Lighting",
      badge: "New",
      discount: 18,
      stock: 5,
      image: "../../assets/images/4-600x800.jpg",
      description: "Modern wall luxury lamp with golden finish",
      images: [
        "../../assets/images/7-600x800.jpg",
        "../../assets/images/6-600x800.jpg",
        "../../assets/images/8_1-600x800.jpg",
        "../../assets/images/9-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 45,
      name: "Minimal White Chair",
      price: 140.99,
      oldPrice: 170,
      rating: 4,
      category: "Furniture",
      badge: "New",
      discount: 17,
      stock: 3,
      image: "../../assets/images/5-600x800.jpg",
      description: "Elegant white minimal chair for modern homes",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/6-600x800.jpg"
      ],
      sellerId: 2003,
      reviews: []
    }).toJSON(),

    new Product({
      id: 46,
      name: "Modern Wooden Table",
      price: 122.75,
      oldPrice: 150,
      rating: 4,
      category: "Furniture",
      badge: "New",
      discount: 18,
      stock: 0,
      image: "../../assets/images/6-600x800.jpg",
      description: "Stylish modern wooden log table",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/5-600x800.jpg"
      ],
      sellerId: 2003,
      reviews: []
    }).toJSON(),

    new Product({
      id: 47,
      name: "Luxury Sofa",
      price: 300,
      oldPrice: 350,
      rating: 5,
      category: "Furniture",
      badge: "New",
      discount: 14,
      stock: 4,
      image: "../../assets/images/7-600x800.jpg",
      description: "Comfortable modern luxury sofa",
      images: [
        "../../assets/images/1_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/10-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 48,
      name: "Art Head Vase",
      price: 122.75,
      oldPrice: 150,
      rating: 4,
      category: "Decor",
      badge: "New",
      discount: 18,
      stock: 0,
      image: "../../assets/images/9-600x800.jpg",
      description: "Artistic decorative head vase",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/1-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),
    new Product({
      id: 49,
      name: "White Ceramic Vase",
      price: 100,
      oldPrice: 120,
      rating: 4,
      category: "Accessories",
      badge: "New",
      discount: 20,
      stock: 12,
      image: "../../assets/images/1-600x800.jpg",
      description: "Cillum dolore lorem ipsum decoration item",
      images: [
        "../../assets/images/2-600x800.jpg",
        "../../assets/images/1-600x800.jpg",
        "../../assets/images/5_1-600x800.jpg",
        "../../assets/images/4-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 50,
      name: "Decor Round Pouf",
      price: 64,
      oldPrice: 78,
      rating: 4,
      category: "Decor",
      badge: "New",
      discount: 20,
      stock: 7,
      image: "../../assets/images/2-600x800.jpg",
      description: "Lorem ipsum cillium dolore decoration item",
      images: [
        "../../assets/images/4-600x800.jpg",
        "../../assets/images/6-600x800.jpg",
        "../../assets/images/1_1-600x800.jpg",
        "../../assets/images/5-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 51,
      name: "Modern Table Lamp",
      price: 180,
      oldPrice: 200,
      rating: 4,
      category: "Lighting",
      badge: "New",
      discount: 20,
      stock: 0,
      image: "../../assets/images/3-600x800.jpg",
      description: "Cillum dolore lorem ipsum decoration item",
      images: [
        "../../assets/images/10-600x800.jpg",
        "../../assets/images/9-600x800.jpg",
        "../../assets/images/8_1-600x800.jpg",
        "../../assets/images/7-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 52,
      name: "Luxury Wall Lamp",
      price: 122.75,
      oldPrice: 150,
      rating: 5,
      category: "Lighting",
      badge: "New",
      discount: 18,
      stock: 5,
      image: "../../assets/images/4-600x800.jpg",
      description: "Modern wall luxury lamp with golden finish",
      images: [
        "../../assets/images/7-600x800.jpg",
        "../../assets/images/6-600x800.jpg",
        "../../assets/images/8_1-600x800.jpg",
        "../../assets/images/9-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 53,
      name: "Minimal White Chair",
      price: 140.99,
      oldPrice: 170,
      rating: 4,
      category: "Furniture",
      badge: "New",
      discount: 17,
      stock: 3,
      image: "../../assets/images/5-600x800.jpg",
      description: "Elegant white minimal chair for modern homes",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/6-600x800.jpg"
      ],
      sellerId: 2003,
      reviews: []
    }).toJSON(),

    new Product({
      id: 54,
      name: "Modern Wooden Table",
      price: 122.75,
      oldPrice: 150,
      rating: 4,
      category: "Furniture",
      badge: "New",
      discount: 18,
      stock: 0,
      image: "../../assets/images/6-600x800.jpg",
      description: "Stylish modern wooden log table",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/5-600x800.jpg"
      ],
      sellerId: 2003,
      reviews: []
    }).toJSON(),

    new Product({
      id: 55,
      name: "Luxury Sofa",
      price: 300,
      oldPrice: 350,
      rating: 5,
      category: "Furniture",
      badge: "New",
      discount: 14,
      stock: 4,
      image: "../../assets/images/7-600x800.jpg",
      description: "Comfortable modern luxury sofa",
      images: [
        "../../assets/images/1_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/10-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON(),

    new Product({
      id: 56,
      name: "Art Head Vase",
      price: 122.75,
      oldPrice: 150,
      rating: 4,
      category: "Decor",
      badge: "New",
      discount: 18,
      stock: 0,
      image: "../../assets/images/9-600x800.jpg",
      description: "Artistic decorative head vase",
      images: [
        "../../assets/images/2_1-600x800.jpg",
        "../../assets/images/3_1-600x800.jpg",
        "../../assets/images/4_1-600x800.jpg",
        "../../assets/images/1-600x800.jpg"
      ],
      sellerId: 2002,
      reviews: []
    }).toJSON()
  ];

  storage.set(STORAGE_KEYS.PRODUCTS, products);
}