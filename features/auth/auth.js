import { renderFooter } from "../../shared/js/footer.js";
import { renderNavbar } from "../../shared/js/navbar.js";
import { STORAGE_KEYS } from "../../shared/js/storage-keys.js";
import { storage } from "../../shared/js/storage.js";
import { seedUsers } from "../../shared/js/user-seed.js";

renderNavbar();
renderFooter();
seedUsers();

/* ---------------- Helpers ---------------- */

function showError(input, errorEl, message){

    input.classList.add("is-invalid");
    input.classList.remove("is-valid");

    errorEl.textContent = message;
    errorEl.classList.remove("d-none");
}

function showValid(input, errorEl){

    input.classList.remove("is-invalid");
    input.classList.add("is-valid");

    errorEl.textContent = "";
    errorEl.classList.add("d-none");
}

/* ---------------- Validation ---------------- */

function validateUsername(username){

    if(!username || username.trim()===""){
        return "Username is required.";
    }

    if(username.length < 3){
        return "Username must be at least 3 characters.";
    }

    if(username.length > 20){
        return "Username must not exceed 20 characters.";
    }

    if(!/^[a-zA-Z0-9_]+$/.test(username)){
        return "Only letters, numbers and underscore allowed.";
    }

    return null;
}

function validateEmail(email){

    const emailRegex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if(!email){
        return "Email is required.";
    }

    if(!emailRegex.test(email)){
        return "Invalid email format.";
    }

    return null;
}

function validatePassword(password){

    if(!password){
        return "Password is required.";
    }

    if(password.length < 8){
        return "Password must be at least 8 characters.";
    }

    if(!/[A-Z]/.test(password)){
        return "Password must contain uppercase letter.";
    }

    if(!/[a-z]/.test(password)){
        return "Password must contain lowercase letter.";
    }

    if(!/[0-9]/.test(password)){
        return "Password must contain number.";
    }

    return null;
}

function validateConfirm(password,confirm){

    if(!confirm){
        return "Please confirm password.";
    }

    if(password!==confirm){
        return "Passwords do not match.";
    }

    return null;
}

/* ---------------- Register ---------------- */

function initRegister(){

    const form=document.getElementById("registerForm");
    if(!form) return;

    const usernameInput=document.getElementById("regUsername");
    const emailInput=document.getElementById("regEmail");
    const passwordInput=document.getElementById("regPassword");
    const confirmInput=document.getElementById("regConfirmPassword");

    const usernameError=document.getElementById("regUsernameError");
    const emailError=document.getElementById("regEmailError");
    const passwordError=document.getElementById("regPasswordError");
    const confirmError=document.getElementById("regConfirmPasswordError");
    const generalError=document.getElementById("regGeneralError");

    /* realtime validation */

    usernameInput.addEventListener("input",()=>{

        const err=validateUsername(usernameInput.value);

        if(err){
            showError(usernameInput,usernameError,err);
        }else{
            showValid(usernameInput,usernameError);
        }

    });

    emailInput.addEventListener("input",()=>{

        const err=validateEmail(emailInput.value);

        if(err){
            showError(emailInput,emailError,err);
        }else{
            showValid(emailInput,emailError);
        }

    });

    passwordInput.addEventListener("input",()=>{

        const err=validatePassword(passwordInput.value);

        if(err){
            showError(passwordInput,passwordError,err);
        }else{
            showValid(passwordInput,passwordError);
        }

    });

    confirmInput.addEventListener("input",()=>{

        const err=validateConfirm(passwordInput.value,confirmInput.value);

        if(err){
            showError(confirmInput,confirmError,err);
        }else{
            showValid(confirmInput,confirmError);
        }

    });

    /* submit */

    form.addEventListener("submit",(e)=>{

e.preventDefault();

const username=usernameInput.value.trim();
const email=emailInput.value.trim();
const password=passwordInput.value;
const confirm=confirmInput.value;

let isValid=true;

/* username */

const usernameErr=validateUsername(username);

if(usernameErr){
showError(usernameInput,usernameError,usernameErr);
isValid=false;
}else{
showValid(usernameInput,usernameError);
}

/* email */

const emailErr=validateEmail(email);

if(emailErr){
showError(emailInput,emailError,emailErr);
isValid=false;
}else{
showValid(emailInput,emailError);
}

/* password */

const passwordErr=validatePassword(password);

if(passwordErr){
showError(passwordInput,passwordError,passwordErr);
isValid=false;
}else{
showValid(passwordInput,passwordError);
}

/* confirm */

const confirmErr=validateConfirm(password,confirm);

if(confirmErr){
showError(confirmInput,confirmError,confirmErr);
isValid=false;
}else{
showValid(confirmInput,confirmError);
}

/* stop register if invalid */

if(!isValid) return;

/* continue register */

const users=storage.get(STORAGE_KEYS.USERS);

const usernameExists=users.find(
u=>u.username.toLowerCase()===username.toLowerCase()
);

if(usernameExists){
generalError.textContent="Username already exists";
generalError.classList.remove("d-none");
return;
}

const emailExists=users.find(
u=>u.email.toLowerCase()===email.toLowerCase()
);

if(emailExists){
generalError.textContent="Email already exists";
generalError.classList.remove("d-none");
return;
}

const newUser={
id:Date.now(),
username:username.toLowerCase(),
email:email.toLowerCase(),
password:password,
role:"customer",
createdAt:new Date().toISOString()
};

users.push(newUser);
storage.set(STORAGE_KEYS.USERS,users);

form.reset();

Swal.fire({
icon:"success",
title:"Account Created!",
text:"Your account created successfully",
confirmButtonText:"Go to Login"
}).then(()=>{
window.location.href="login.html";
});

});

}

/* ---------------- Login ---------------- */

function initLogin(){

const form = document.getElementById("loginForm");
if(!form) return;

const identifierInput = document.getElementById("loginIdentifier");
const passwordInput = document.getElementById("loginPassword");

const identifierError = document.getElementById("loginIdentifierError");
const passwordError = document.getElementById("loginPasswordError");

form.addEventListener("submit",(e)=>{

e.preventDefault();

const identifier = identifierInput.value.trim().toLowerCase();
const password = passwordInput.value;

let isValid = true;

/* identifier validation */

if(!identifier){

showError(
identifierInput,
identifierError,
"Email or username is required"
);

isValid = false;

}else{

showValid(identifierInput,identifierError);

}

/* password validation */

if(!password){

showError(
passwordInput,
passwordError,
"Password is required"
);

isValid = false;

}else{

showValid(passwordInput,passwordError);

}

if(!isValid) return;

/* check user */

const users = storage.get(STORAGE_KEYS.USERS) || [];

const user = users.find(
u =>
(u.email === identifier || u.username === identifier) &&
u.password === password
);

/* ❌ login failed */

if(!user){

Swal.fire({
icon:"error",
title:"Login Failed",
text:"Invalid email or password"
});

return;

}

/* ✅ login success */

const sessionUser = {
id:user.id,
username:user.username,
email:user.email,
role:user.role
};

storage.set(STORAGE_KEYS.CURRENT_USER,sessionUser);

 

if(user.role==="admin"){
window.location.href="../admin/panel.html";
}
else if(user.role==="seller"){
window.location.href="../seller/dashboard.html";
}
else{
window.location.href="../products/products-list.html";
}

 

});

}


const togglePassword=document.getElementById("togglePassword");

if(togglePassword){

togglePassword.addEventListener("click",()=>{

const passwordInput=document.getElementById("regPassword");
const icon=togglePassword.querySelector("i");

if(passwordInput.type==="password"){

passwordInput.type="text";
icon.classList.replace("fa-eye","fa-eye-slash");

}else{

passwordInput.type="password";
icon.classList.replace("fa-eye-slash","fa-eye");

}

});

}

const toggleLoginPassword = document.getElementById("toggleLoginPassword");

if (toggleLoginPassword) {

toggleLoginPassword.addEventListener("click", () => {

const input = document.getElementById("loginPassword");
const icon = toggleLoginPassword.querySelector("i");

if (input.type === "password") {

input.type = "text";
icon.classList.replace("fa-eye","fa-eye-slash");

} else {

input.type = "password";
icon.classList.replace("fa-eye-slash","fa-eye");

}

});

}

/* ---------------- Init ---------------- */

initRegister();
initLogin();