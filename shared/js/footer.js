export function renderFooter() {
    const footer = document.querySelector("footer");

    if (!footer)
        return;

    footer.className = "bg-dark text-white mt-5";
    footer.innerHTML = `
        <div class="container">
            <div class="row py-4">
                <div class="col-md-4 mb-3">
                    <h5><i class="fas fa-store"></i> E-Commerce</h5>
                    <p class="text-muted">Your trusted online shopping destination</p>
                </div>
                <div class="col-md-4 mb-3">
                    <h5>Quick Links</h5>
                    <ul class="list-unstyled">
                        <li><a href="/index.html" class="text-white-50 text-decoration-none">Home</a></li>
                        <li><a href="/features/products/products-list.html" class="text-white-50 text-decoration-none">Products</a></li>
                        <li><a href="/features/cart/cart.html" class="text-white-50 text-decoration-none">Cart</a></li>
                    </ul>
                </div>
                <div class="col-md-4 mb-3">
                    <h5>Contact Us</h5>
                    <p class="text-muted">
                        <i class="fas fa-envelope"></i> info@ecommerce.com<br>
                        <i class="fas fa-phone"></i> +20 123 456 7890
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col-12 text-center border-top pt-3">
                    <p class="text-muted mb-0">© 2026 E-Commerce Project. All rights reserved.</p>
                </div>
            </div>
        </div>
    `;
}