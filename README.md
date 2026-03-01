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

- Product management (Create, Read, Update, Delete)
- Order processing and status updates
- Sales analytics with charts
- Inventory management
- Performance metrics

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
│   │   ├── dashboard.html     # Seller dashboard
│   │   ├── seller.js          # Seller logic
│   │   └── seller.css         # Seller styles
│   │
│   └── admin/                 # Admin panel module
│       ├── panel.html         # Admin panel
│       ├── admin.js           # Admin logic
│       └── admin.css          # Admin styles
│
├── shared/                    # Shared resources
│   ├── css/
│   │   └── global.css         # Global styles
│   └── js/
│       ├── storage.js         # LocalStorage management
│       ├── utils.js           # Utility functions
│       └── app.js             # Main application logic
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

Provides seller dashboard and product management.

**Files:**

- `dashboard.html`: Seller control panel
- `seller.js`: Product CRUD, order management, analytics
- `seller.css`: Dashboard styling

**Responsibilities:**

- Product inventory management
- Order processing
- Sales analytics visualization
- Statistics display

#### 5. Admin Module (`features/admin/`)

Complete administrative control panel.

**Files:**

- `panel.html`: Admin interface
- `admin.js`: User management, system oversight
- `admin.css`: Admin panel styling

**Responsibilities:**

- User account management
- Product moderation
- System-wide analytics
- Customer service tools

#### 6. Shared Resources (`shared/`)

Common utilities and styles used across modules.

**Files:**

- `global.css`: Application-wide styles
- `storage.js`: LocalStorage CRUD operations
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
