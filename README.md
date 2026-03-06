# Multi-Actor E-Commerce System

A comprehensive e-commerce platform supporting three distinct user roles: Customers, Sellers, and Admins. Built with HTML, CSS, JavaScript, and Bootstrap 5.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technical Stack](#technical-stack)
- [Project Structure](#project-structure)
- [User Roles and Permissions](#user-roles-and-permissions)

---

## Project Overview

This e-commerce system is designed to provide a complete online shopping experience with role-based access control. The platform enables customers to browse and purchase products, sellers to manage their inventory and orders, and administrators to oversee the entire system.

### Objectives

- Develop a fully functional e-commerce platform using modern web technologies
- Implement secure user authentication and role-based access control
- Create responsive interfaces that work seamlessly across all devices
- Provide comprehensive dashboards for sellers and administrators
- Automatically seed a default administrator account when the application first runs
- Enable real-time data visualization for sales analytics

---

## Key Features

### 1. User Authentication

- Secure login and registration system
- Role-based access control (Customer, Seller, Admin)
- Session management using LocalStorage
- Password validation and security measures

### 2. Home Page

- Featured products showcase
- Category navigation
- Promotional banners
- Responsive layout using Bootstrap grid system

### 3. Product Catalog

- Complete product listing with images, names, and prices
- Search functionality
- Category-based filtering
- Sort options (price, name, date)
- "Add to Cart" functionality

### 4. Product Details Page

- Detailed product information
- Image gallery
- Product specifications
- Quantity selector
- Related products
- Navigation back to catalog

### 5. Shopping Cart

- Add/remove items
- Update quantities
- Real-time price calculations
- Subtotal, shipping, and tax display
- Persistent cart using LocalStorage

### 6. Checkout Process

- Shipping information form
- Payment method selection
- Order summary
- Form validation
- Order confirmation

### 7. Seller Dashboard

- **Analytics Dashboard**
  - Real-time statistics (products, orders, sales, low stock alerts)
  - Sales trend visualization with Chart.js (7-day line chart)
  - Product status distribution (doughnut chart)
  - Recent orders overview (last 5 orders)
  - Quick action buttons for common tasks
- **Product Management**
  - Separate pages for listing, adding, and editing products
  - Two-column form layout to eliminate scrolling
  - Image upload with live preview
  - CRUD operations (Create, Read, Update, Delete)
  - Stock management with color-coded badges
- **Order Processing**
  - Order status updates
  - Performance metrics
- **Inventory Management**
  - Low stock alerts
  - Stock tracking

### 8. Admin Panel

- Complete system oversight
- User management (view, edit, delete, password reset)
- Product moderation and approval
- Order monitoring
- Customer service tools
- System-wide analytics

### 9. Responsive Design

- Mobile-first approach
- Tablet optimization
- Desktop enhancement
- Cross-browser compatibility

---

## Technical Stack

### Frontend Technologies

- **HTML5**: Semantic markup and structure
- **CSS3**: Custom styling and animations
- **Bootstrap 5**: Responsive framework and UI components
- **JavaScript ES6+**: Dynamic functionality and interactivity
- **Chart.js**: Data visualization for analytics dashboards
- **FontAwesome**: Icon library for UI elements

### Data Management

- **LocalStorage API**: Client-side data persistence
- JSON format for data structure

---

## Project Structure

```
E-Commerce-CST/
│
├── index.html                 # Main homepage
├── main.js                    # Homepage JavaScript
├── style.css                  # Homepage styles
│
├── features/                  # Feature modules
│   │
│   ├── auth/                  # Authentication module
│   │   ├── login.html         # Login page
│   │   ├── register.html      # Registration page
│   │   ├── auth.js            # Authentication logic
│   │   └── auth.css           # Authentication styles
│   │
│   ├── products/              # Products module
│   │   ├── catalog.html       # Product catalog page
│   │   ├── product-details.html  # Product details page
│   │   ├── products.js        # Products logic
│   │   └── products.css       # Products styles
│   │
│   ├── cart/                  # Shopping cart module
│   │   ├── cart.html          # Cart page
│   │   ├── checkout.html      # Checkout page
│   │   ├── cart.js            # Cart logic
│   │   └── cart.css           # Cart styles
│   │
│   ├── seller/                # Seller dashboard module
│   │   ├── dashboard.html     # Main analytics dashboard
│   │   ├── dashboard.js       # Dashboard logic and charts
│   │   ├── manage-products.html  # Product listing
│   │   ├── manage-products.js    # Product management logic
│   │   ├── add-product.html   # Add new product form
│   │   ├── add-product.js     # Product creation logic
│   │   ├── edit-product.html  # Edit product form
│   │   ├── edit-product.js    # Product update logic
│   │   └── seller.css         # Seller styles
│   │
│   └── admin/                 # Admin panel module
│       ├── panel.html         # Admin panel
│       ├── admin.js           # Admin logic
│       └── admin.css          # Admin styles
│
├── shared/                    # Shared resources
│   ├── bootstrap/             # Bootstrap framework
│   ├── fontawesome/           # FontAwesome icons
│   └── js/
│       ├── navbar.js          # Navigation bar component
│       ├── footer.js          # Footer component
│       ├── storage.js         # LocalStorage wrapper
│       ├── storage-keys.js    # Storage key constants
│       ├── Product.js         # Product class model
│       ├── User.js            # User class model
│       ├── products-seed.js   # Product seed data
│       ├── user-seed.js       # User seed data
│       └── utils.js           # Utility functions
│
└── assets/                    # Static assets
    ├── images/                # Image files
    └── icons/                 # Icon files
```

### Module Breakdown

#### 1. Authentication Module (`features/auth/`)

Handles user login, registration, and session management.

**Files:**

- `login.html`: User login interface
- `register.html`: New user registration
- `auth.js`: Authentication logic, validation, session management
- `auth.css`: Authentication page styling

**Responsibilities:**

- User credential validation
- Role-based redirections
- Session persistence
- Security measures

#### 2. Products Module (`features/products/`)

Manages product display, search, and details.

**Files:**

- `catalog.html`: Product listing page
- `product-details.html`: Individual product view
- `products.js`: Product display, search, filter logic
- `products.css`: Product page styling

**Responsibilities:**

- Dynamic product rendering
- Search and filter implementation
- Product detail display
- Category management

#### 3. Cart Module (`features/cart/`)

Handles shopping cart and checkout process.

**Files:**

- `cart.html`: Shopping cart view
- `checkout.html`: Order checkout page
- `cart.js`: Cart operations, calculations
- `cart.css`: Cart page styling

**Responsibilities:**

- Cart item management
- Price calculations
- Checkout form handling
- Order creation

#### 4. Seller Module (`features/seller/`)

Provides seller dashboard and product management with analytics.

**Files:**

- `dashboard.html`: Main analytics dashboard with charts and statistics
- `dashboard.js`: Dashboard logic, Chart.js implementation
- `manage-products.html`: Product listing with edit/delete actions
- `manage-products.js`: Product management operations
- `add-product.html`: Add new product form (two-column layout)
- `add-product.js`: Product creation with image upload
- `edit-product.html`: Edit product form (two-column layout)
- `edit-product.js`: Product update logic
- `seller.css`: Seller module styling

**Responsibilities:**

- Analytics visualization (sales trends, product status distribution)
- Real-time statistics (products, orders, sales, low stock alerts)
- Product CRUD operations with separate pages for each action
- Image upload with live preview
- Order processing and status updates
- Inventory management with stock tracking
- Two-column form design to eliminate scrolling

#### 5. Admin Module (`features/admin/`)

Complete administrative control panel.

**Files:**

- `panel.html`: Admin interface
- `admin.js`: User management, system oversight
- `admin.css`: Admin panel styling

*Note*: an initial admin user (username `admin`, password `Admin@123`) is seeded into localStorage so that the panel can be accessed after first launch.
Administrators can create additional admin accounts directly from the dashboard using the "Create New Administrator" form.
**Responsibilities:**

- User account management (create/edit/delete with role assignment)
- Product moderation (approve/unapprove, delete)
- Search, filtering, and pagination in user list
- Confirmation modals for destructive actions and role changes
- Dark mode toggle on navigation bar (preference saved in localStorage); theme now applies across *all pages* with coordinated background/text colors via global styles
- System-wide analytics
- Customer service tools

#### 6. Shared Resources (`shared/`)

Common utilities, components, and data models used across modules.

**Files:**

- `js/navbar.js`: Dynamic navigation bar component
- `js/footer.js`: Footer component with company info and links
- `js/storage.js`: LocalStorage wrapper with get/set/remove functions
- `js/storage-keys.js`: Centralized storage key constants
- `js/Product.js`: Product class model with validation
- `js/User.js`: User class model for authentication
- `js/products-seed.js`: Default product data for development
- `js/user-seed.js`: Default user accounts (admin, sellers, customers)
- `js/utils.js`: Utility helper functions
- `global.css`: Application-wide styles and theme
- `bootstrap/`: Bootstrap 5 framework files
- `fontawesome/`: FontAwesome icon library

**Data Models:**

- **Product Class**: (id, name, price, oldPrice, rating, badge, discount, stock, image, description, images, sellerId, reviews, createdAt, updatedAt)
- **User Class**: (id, username, email, password, role, createdAt)

**Responsibilities:**

- Consistent UI components across all pages
- Data persistence and retrieval
- Input validation and sanitization
- Date/time formatting
- Global styling and theming
- `utils.js`: Helper functions (validation, formatting, etc.)
- `app.js`: Core application initialization

**Responsibilities:**

- Data persistence layer
- Common UI components
- Utility functions
- Application initialization

---

## User Roles and Permissions

### Customer

**Capabilities:**

- Browse product catalog
- Search and filter products
- View product details
- Add items to shopping cart
- Complete checkout process
- View order history
- Manage account settings

**Access Restrictions:**

- Cannot access seller or admin panels
- Cannot add or modify products
- Cannot view other users' information

### Seller

**Capabilities:**

- All customer capabilities
- Access seller dashboard
- Add new products
- Edit existing products
- Delete products
- View and process orders
- Access sales analytics
- Manage inventory

**Access Restrictions:**

- Cannot access admin panel
- Cannot manage other users
- Cannot moderate other sellers' products

### Admin

**Capabilities:**

- Full system access
- Manage all user accounts
- Create, edit, delete any user
- Reset user passwords
- Moderate all product listings
- Approve or reject products
- View all orders
- Access comprehensive analytics
- Handle customer service requests
- System configuration

**Access Restrictions:**

- None (full access)

---

## Recent Updates

### March 6, 2026 - Seller Dashboard Restructuring

Major improvements to the seller interface:

- **Separated seller functionality** into distinct pages (dashboard, manage, add, edit)
- **Analytics dashboard** with Chart.js visualizations (sales trends, product distribution)
- **Two-column form layout** for add/edit pages to eliminate scrolling
- **Data model cleanup** - removed category from Product class, removed sellerId from User class
- **UI/UX enhancements** - optimized spacing, color-coded stock badges, live image preview

For detailed changelog, see [ziad-hany-changelog-2026-03-01.md](ziad-hany-changelog-2026-03-06.md)

---

## Development Notes

- Project uses **LocalStorage** for data persistence (no backend required)
- Default admin credentials: `username: admin, password: Admin@123`
- Default seller accounts available in seed data
- **Chart.js** CDN used for analytics visualization
- **Bootstrap 5.3.2** for responsive design
- All forms include client-side validation
