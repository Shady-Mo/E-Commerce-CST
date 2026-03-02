import { storage } from "../../storage.js";
import { STORAGE_KEYS } from "../../storage-keys.js";

export function seedProducts() {
  const existingProducts = storage.get(STORAGE_KEYS.PRODUCTS);

  if (existingProducts.length > 0) return;

  const products = [
  {
    id: 1,
    name: "Luxury Lamp for Wall",
    price: 122.75,
    image: "../../../../assets/images/shop-01-BAqz1L0h.jpg",
    description: "Modern wall luxury lamp with golden finish"
  },
  {
    id: 2,
    name: "White Minimal Chair",
    price: 140.99,
    image: "../../../../assets/images/shop-02-l48GIY89.jpg",
    description: "Elegant white minimal chair for modern homes"
  },
  {
    id: 3,
    name: "Premium Luxury Sofa",
    price: 122.75,
    image: "../../../../assets/images/shop-03-VygFK45X.jpg",
    description: "Comfortable modern luxury sofa"
  },
  {
    id: 4,
    name: "Modern Wooden Table",
    price: 25.75,
    image: "../../../../assets/images/shop-04-2ZYcisKE.jpg",
    description: "Minimal wooden desk table"
  },
  {
    id: 5,
    name: "Luxury Vase for Table",
    price: 122.75,
    image: "../../../../assets/images/shop-05-CDjYQUxn.jpg",
    description: "Modern decorative vase"
  },
  {
    id: 6,
    name: "Modern Log Table",
    price: 122.75,
    image: "../../../../assets/images/shop-06-Dys26vKi.jpg",
    description: "Stylish modern wooden log table"
  },
  {
    id: 7,
    name: "New Modern Table with Pops",
    price: 140.99,
    image: "../../../../assets/images/shop-07-DFw55T-5.jpg",
    description: "Luxury modern design table"
  },
  {
    id: 8,
    name: "Decorative Head Vase",
    price: 122.75,
    image: "../../../../assets/images/shop-09-C1D1hAdi.jpg",
    description: "Artistic decorative head vase"
  }
];
  storage.set(STORAGE_KEYS.PRODUCTS, products);
}