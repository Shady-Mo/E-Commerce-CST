import { storage } from "../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { renderNavbar, updateCartBadge } from "../../shared/js/navbar.js";
import { renderFooter } from "../../shared/js/footer.js";

/* ---------------- Layout ---------------- */

renderNavbar();
renderFooter();

/* ---------------- Auth Protection ---------------- */

const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

if (!currentUser) {
  window.location.href = "../auth/login.html";
}

/* ---------------- Cart Data ---------------- */

const cartKey = `cart_${currentUser.id}`;
let cart = storage.get(cartKey) || [];

const itemsContainer = document.getElementById("checkoutItems");

let subtotal = 0;

cart.forEach(item => {

  const total = item.price * item.quantity;
  subtotal += total;

  itemsContainer.innerHTML += `
  <div class="cart-item d-flex justify-content-between">
    <span>${item.name} x ${item.quantity}</span>
    <span>$${total.toFixed(2)}</span>
  </div>
  `;

});

const shipping = 0;
const grandTotal = subtotal + shipping;

document.getElementById("subTotal").textContent = `$${subtotal.toFixed(2)}`;
document.getElementById("shipping").textContent = `$${shipping.toFixed(2)}`;
document.getElementById("grandTotal").textContent = `$${grandTotal.toFixed(2)}`;

/* ---------------- Place Order ---------------- */

const placeBtn = document.getElementById("placeOrderBtn");

placeBtn.addEventListener("click", () => {

  if(cart.length === 0){
    alert("Your cart is empty");
    return;
  }

  const firstName = document.getElementById("firstName").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address1").value.trim();

  if(!firstName || !email || !address){
    Swal.fire({
icon:"warning",
title:"Payment required",
text:"Please Enter required fields"
});
    return;
  }

  const payment = document.querySelector('input[name="payment"]:checked');

  if(!payment){

Swal.fire({
icon:"warning",
title:"Payment required",
text:"Please select a payment method"
});

return;

}

  const orders = storage.get(STORAGE_KEYS.ORDERS) || [];

  const newOrder = {
    id: Date.now(),
    userId: currentUser.id,
    items: cart,
    total: grandTotal,
    payment: payment.value,
    status: "Pending",
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);

  storage.set(STORAGE_KEYS.ORDERS, orders);

  /* empty cart correctly */

  storage.set(cartKey, []);
  cart = [];

  /* prevent multiple clicks */

  placeBtn.disabled = true;

  Swal.fire({
    icon:"success",
    title:"Order placed successfully"
  }).then(()=>{
    window.location.href="../customer/myOrders/order.html";
  });

});