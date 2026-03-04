import { renderNavbar, applyTheme } from "./shared/js/navbar.js";
import { renderFooter } from "./shared/js/footer.js";
import { seedProducts } from "./shared/js/products-seed.js";
import { seedUsers } from "./shared/js/user-seed.js";

// apply theme early so page doesn't flash default colors
const storedTheme = localStorage.getItem('theme');
if (storedTheme) applyTheme(storedTheme);

renderNavbar();
renderFooter();

seedProducts();
seedUsers();