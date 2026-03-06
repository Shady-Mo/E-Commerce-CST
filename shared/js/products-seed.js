import { storage } from "./storage.js";
import { STORAGE_KEYS } from "./storage-keys.js";

export function seedProducts() {

const existingProducts = storage.get(STORAGE_KEYS.PRODUCTS);
if (existingProducts && existingProducts.length > 0) return;

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
stock:12,
image:"../../assets/images/1-600x800.jpg",
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
discount:20,
stock:7,
image:"../../assets/images/2-600x800.jpg",
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
discount:20,
stock:0,   // Out of stock example
image:"../../assets/images/3-600x800.jpg",
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
discount:18,
stock:5,
image:"../../assets/images/4-600x800.jpg",
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
discount:17,
stock:3,
image:"../../assets/images/5-600x800.jpg",
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
discount:18,
stock:0,   // Out of stock
image:"../../assets/images/6-600x800.jpg",
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
discount:14,
stock:4,
image:"../../assets/images/7-600x800.jpg",
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
discount:18,
stock:0,
image:"../../assets/images/9-600x800.jpg",
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