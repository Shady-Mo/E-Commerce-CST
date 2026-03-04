import { storage } from "./storage.js";
import { STORAGE_KEYS } from "./storage-keys.js";

export function seedProducts() {

const existingProducts = storage.get(STORAGE_KEYS.PRODUCTS);
if (existingProducts.length > 0) return;

const products = [

{
id:1,
name:"White Ceramic Vase",
category:"Decor",
price:100,
oldPrice:120,
rating:4,
badge:"New",
discount:20,
image: "../../assets/images/shop-04-2ZYcisKE.jpg",
description:"Cillum dolore lorem ipsum decoration item",
images:[
"../../assets/images/2-600x800.jpg",
"../../assets/images/1-600x800.jpg",
"../../assets/images/5_1-600x800.jpg"
]
},

{
id:2,
name:"Decor Round Pouf",
category:"Decor",
price:64,
oldPrice:78,
rating:4,
badge:"New",
image: "../../assets/images/shop-04-2ZYcisKE.jpg",
discount:20,
description:"Lorem ipsum cillium dolore decoration item",
images:[
"../../assets/images/4-600x800.jpg",
"../../assets/images/6-600x800.jpg",
"../../assets/images/1_1-600x800.jpg"
]
},

{
id:3,
name:"Modern Table Lamp",
category:"Vase",
price:180,
oldPrice:200,
rating:4,
badge:"New",
image: "../../assets/images/shop-04-2ZYcisKE.jpg",
discount:20,
description:"Cillum dolore lorem ipsum decoration item",
images:[
"../../assets/images/10-600x800.jpg",
"../../assets/images/9-600x800.jpg",
"../../assets/images/8_1-600x800.jpg"
]
},

{
id:4,
name:"Luxury Wall Lamp",
category:"Lighting",
price:122.75,
oldPrice:150,
rating:5,
badge:"New",
image: "../../assets/images/shop-04-2ZYcisKE.jpg",
discount:18,
description:"Modern wall luxury lamp with golden finish",
images:[
"../../assets/images/7-600x800.jpg",
"../../assets/images/6-600x800.jpg",
"../../assets/images/8_1-600x800.jpg"
]
},

{
id:5,
name:"Minimal White Chair",
category:"Furniture",
price:140.99,
oldPrice:170,
rating:4,
badge:"New",
image: "../../assets/images/shop-04-2ZYcisKE.jpg",
discount:17,
description:"Elegant white minimal chair for modern homes",
images:[
"../../assets/images/2_1-600x800.jpg",
"../../assets/images/3_1-600x800.jpg",
"../../assets/images/4_1-600x800.jpg"
]
},

{
id:6,
name:"Modern Wooden Table",
category:"Furniture",
price:122.75,
oldPrice:150,
rating:4,
badge:"New",
image: "../../assets/images/shop-04-2ZYcisKE.jpg",
discount:18,
description:"Stylish modern wooden log table",
images:[
"../../assets/images/2_1-600x800.jpg",
"../../assets/images/3_1-600x800.jpg",
"../../assets/images/4_1-600x800.jpg"
]
},

{
id:7,
name:"Luxury Sofa",
category:"Furniture",
price:300,
oldPrice:350,
rating:5,
badge:"New",
image: "../../assets/images/shop-04-2ZYcisKE.jpg",
discount:14,
description:"Comfortable modern luxury sofa",
images:[
"../../assets/images/1_1-600x800.jpg",
"../../assets/images/3_1-600x800.jpg",
"../../assets/images/4_1-600x800.jpg"
]
},

{
id:8,
name:"Art Head Vase",
category:"Decor",
price:122.75,
oldPrice:150,
rating:4,
badge:"New",
image: "../../assets/images/shop-04-2ZYcisKE.jpg",
discount:18,
description:"Artistic decorative head vase",
images:[
"../../assets/images/2_1-600x800.jpg",
"../../assets/images/3_1-600x800.jpg",
"../../assets/images/4_1-600x800.jpg"
]
}

];

storage.set(STORAGE_KEYS.PRODUCTS, products);

}