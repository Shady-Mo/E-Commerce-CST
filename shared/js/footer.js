export function renderFooter() {

    const footer = document.querySelector("footer");
    if (!footer) return;

    const prefix = computePrefix();

    footer.className = "footer-section text-white mt-5";

    footer.innerHTML = `
    <div class="footer-overlay py-5">

        <!-- Newsletter -->
        <div class="container mb-5">
            <div class="row align-items-center">

                <div class="col-md-6">
                    <h2 class="fw-bold mb-3">Newsletter</h2>
                    <p class="text-white-50">
                        Stay in the loop with exclusive offers and updates.
                        Subscribe to our newsletter for the latest trends and promotions.
                    </p>
                </div>

                <div class="col-md-6">
                    <div class="d-flex newsletter-box">
                        <input 
                            type="email" 
                            class="form-control bg-transparent text-white border-secondary rounded-0" 
                            placeholder="Enter your email address"
                        >
                        <button class="btn subscribe-btn rounded-0">
                            Subscribe
                        </button>
                    </div>
                </div>

            </div>
        </div>

        <!-- Footer Links -->
        <div class="container">
            <div class="row gy-4">

                <div class="col-md-2">
                    <h5 class="fw-bold">Sitemap</h5>
                    <ul class="list-unstyled footer-links">
                        <li><a href="#">About</a></li>
                        <li><a href="#">Team</a></li>
                        <li><a href="#">Portfolio</a></li>
                        <li><a href="#">Clients</a></li>
                        <li><a href="#">Error</a></li>
                    </ul>
                </div>

                <div class="col-md-2">
                    <h5 class="fw-bold">Others</h5>
                    <ul class="list-unstyled footer-links">
                        <li><a href="#">Shipping Method</a></li>
                        <li><a href="#">Payment Method</a></li>
                        <li><a href="#">My Account</a></li>
                        <li><a href="#">Coming Soon</a></li>
                    </ul>
                </div>

                <div class="col-md-4 text-center">
                    <img src="../../assets/images/logo-light-CajGk_JI.svg" height="45" class="mb-3">
                    <p class="text-white-50">
                        Furnixar is a modern furniture template for an eCommerce website designed to help you create an impressive online store.
                    </p>

                    <div class="social-icons mt-3">
                        <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="#"><i class="fa-brands fa-twitter"></i></a>
                        <a href="#"><i class="fa-brands fa-instagram"></i></a>
                        <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
                    </div>
                </div>

                <div class="col-md-2">
                    <h5 class="fw-bold">Shop</h5>
                    <ul class="list-unstyled footer-links">
                        <li><a href="#">Shop</a></li>
                        <li><a href="#">Product Single</a></li>
                        <li><a href="#">Cart</a></li>
                        <li><a href="#">Checkout</a></li>
                        <li><a href="#">Wishlist</a></li>
                    </ul>
                </div>

                <div class="col-md-2">
                    <h5 class="fw-bold">Customer Service</h5>
                    <ul class="list-unstyled footer-links">
                        <li><a href="#">FAQs</a></li>
                        <li><a href="#">Terms & Condition</a></li>
                        <li><a href="#">Return Policy</a></li>
                        <li><a href="${prefix}features/contact/contact.html">Contact</a></li>
                    </ul>
                </div>

            </div>

            <hr class="border-secondary my-4">

            <div class="text-center text-white-50">
                © 2026 Furnixar - Developed by احنا نقاشين بلدنا Team
            </div>
        </div>

    </div>
    `;
}

function computePrefix() {

    const moduleUrl = new URL(import.meta.url);
    const modulePath = decodeURIComponent(moduleUrl.pathname);
    const marker = "/shared/js/footer.js";
    const markerIdx = modulePath.lastIndexOf(marker);

    if (markerIdx === -1) return "";

    const rootPath = modulePath.substring(0, markerIdx) + "/";
    const pagePath = decodeURIComponent(window.location.pathname);
    const pageDir = pagePath.substring(0, pagePath.lastIndexOf("/") + 1);

    if (!pageDir.startsWith(rootPath)) return "";

    const relative = pageDir.substring(rootPath.length);
    const depth = relative.split("/").filter(Boolean).length;

    return "../".repeat(depth);

}