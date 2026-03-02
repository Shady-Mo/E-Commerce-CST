export function renderNavbar() {
    const nav = document.querySelector("nav");

    if (!nav)
        return;

    nav.className = "navbar navbar-expand-lg navbar-dark bg-dark";
    nav.innerHTML = `
        <div class="container-fluid">
            <a class="navbar-brand" href="/index.html">
                <i class="fas fa-store"></i> E-Commerce
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">

                    <li class="nav-item">
                        <a class="nav-link" href="/features/auth/login.html">
                            <i class="fas fa-sign-in-alt"></i> Login
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/features/auth/register.html">
                            <i class="fas fa-user-plus"></i> Register
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    `;
}
