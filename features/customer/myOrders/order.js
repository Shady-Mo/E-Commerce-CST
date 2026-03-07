import { storage } from "../../../shared/js/storage.js";
import { STORAGE_KEYS } from "../../../shared/js/storage-keys.js";
import { renderNavbar, updateCartBadge } from "../../../shared/js/navbar.js";
import { renderFooter } from "../../../shared/js/footer.js";

/* ---------------- Layout ---------------- */

renderNavbar();
renderFooter();

const currentUser = storage.get(STORAGE_KEYS.CURRENT_USER);

if(!currentUser){
window.location.href="../auth/login.html";
}

const orders = storage.get(STORAGE_KEYS.ORDERS) || [];

const myOrders = orders.filter(o => o.userId === currentUser.id);

const container = document.getElementById("ordersContainer");

if(myOrders.length === 0){

container.innerHTML = `
<div class="col-12 text-center py-5">

<i class="fa-solid fa-box-open fa-3x mb-3 text-muted"></i>

<h4>No orders yet</h4>

<p class="text-muted">Start shopping and place your first order</p>

<a href="../products/products-list.html" class="btn btn-primary">
Shop Now
</a>

</div>
`;

}

myOrders.forEach(order=>{

let itemsHTML="";

order.items.forEach(item=>{

itemsHTML+=`
<div class="order-product">

<span>${item.name} x ${item.quantity}</span>

<span>$${(item.price * item.quantity).toFixed(2)}</span>

</div>
`;

});

container.innerHTML += `

<div class="col-md-6">

<div class="order-card">

<div class="order-header">

<div>

<strong>Order #${order.id}</strong>

<br>

<small class="text-muted">
${new Date(order.createdAt).toLocaleDateString()}
</small>

</div>

<span class="order-status status-pending">
${order.status}
</span>

</div>

${itemsHTML}

<div class="order-total">

Total: $${order.total}

</div>

</div>

</div>

`;

});

