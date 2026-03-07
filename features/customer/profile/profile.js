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

/* ---------------- Load user data ---------------- */

const users = storage.get(STORAGE_KEYS.USERS) || [];

const user = users.find(u => u.id === currentUser.id);

document.getElementById("profileUsername").value = user.username;
document.getElementById("profileEmail").value = user.email;

/* ---------------- Update profile ---------------- */

document.getElementById("profileForm").addEventListener("submit",(e)=>{

e.preventDefault();

const username = document.getElementById("profileUsername").value.trim();
const email = document.getElementById("profileEmail").value.trim();
const password = document.getElementById("profilePassword").value;
const confirm = document.getElementById("profileConfirmPassword").value;

/* validation */

if(!username || !email){

Swal.fire({
icon:"warning",
title:"Missing information",
text:"Username and email are required"
});

return;

}

/* password change */

if(password){

if(password !== confirm){

Swal.fire({
icon:"error",
title:"Password mismatch",
text:"Passwords do not match"
});

return;

}

user.password = password;

}

/* update user */

user.username = username;
user.email = email;

storage.set(STORAGE_KEYS.USERS, users);

/* update session */

currentUser.username = username;
currentUser.email = email;

storage.set(STORAGE_KEYS.CURRENT_USER,currentUser);

Swal.fire({
icon:"success",
title:"Profile updated successfully"
});

});



const toggle = document.getElementById("toggleProfilePassword");

if(toggle){

toggle.addEventListener("click",()=>{

const input = document.getElementById("profilePassword");
const icon = toggle.querySelector("i");

if(input.type === "password"){

input.type = "text";
icon.classList.replace("fa-eye","fa-eye-slash");

}else{

input.type = "password";
icon.classList.replace("fa-eye-slash","fa-eye");

}

});

}