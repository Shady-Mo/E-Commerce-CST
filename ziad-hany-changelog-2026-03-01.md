# Changelog - March 1, 2026

## New Features

### Navigation Bar

- **File**: `shared/js/navbar.js`
- Created responsive Bootstrap navbar component
- Features:
  - Dark theme navigation bar
  - Responsive design with mobile hamburger menu
  - Navigation links to Login and Register pages
  - FontAwesome icons integration
  - Brand logo with store icon

### Footer Component

- **File**: `shared/js/footer.js`
- Implemented professional Bootstrap footer
- Features:
  - Three-column responsive layout
  - Company information section
  - Quick links section
  - Contact information with email and phone
  - Copyright notice
  - Dark theme matching the navbar

### Storage Utilities

- **File**: `shared/js/storage-keys.js`
- Centralized storage key constants
- Defined keys for: USERS, CURRENT_USER, PRODUCTS, ORDERS, CART

- **File**: `shared/js/storage.js`
- Implemented localStorage wrapper functions
- Functions:
  - `get(key)` - Retrieve data with error handling
  - `set(key, value)` - Store data with error handling
  - `remove(key)` - Remove data with error handling

### Main Application Entry Point

- **File**: `main.js`
- Added imports for navbar and footer components

### Home Page

- **File**: `index.html`
- Changed page title from "Document" to "E-Commerce"
- Added `<nav>` placeholder element
- Added `<footer>` placeholder element
- Added `.main-section` class to main content area

### Global Styles

- **File**: `global.css`
- Implemented flexbox layout for sticky footer
- CSS additions:
  - Full viewport height for html and body
  - Flex column layout for body
  - Flexible main section
  - Fixed footer positioning

### Products Module

- **File**: `features/products/products.js`
- Added storage integration
- Imports STORAGE_KEYS and storage utilities
- Initial call to retrieve products from localStorage

---

## Usage Guide for Developers

### How to Use Navbar and Footer in New Pages

To maintain consistency across all pages, follow this standard page structure:

#### HTML Structure Template

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Page Title</title>

    <!-- Bootstrap CSS -->
    <link href="../../shared/bootstrap/bootstrap.min.css" rel="stylesheet" />
    <!-- FontAwesome CSS -->
    <link href="../../shared/fontawesome/css/all.min.css" rel="stylesheet" />
    <!-- Global Styles -->
    <link href="../../global.css" rel="stylesheet" />

    <!-- Bootstrap JS -->
    <script src="../../shared/js/bootstrap/bootstrap.bundle.min.js" defer></script>
    <!-- Main JS Module -->
    <script type="module" src="../../main.js"></script>
  </head>
  <body>

    <!-- 1. Navigation Bar -->
    <nav></nav>

    <!-- 2. Main Content Wrapper with .main-section class -->
    <div class="main-section container">
      <!-- Your page content goes here -->
      <h1>Page Title</h1>
      <p>Page content...</p>
    </div>

    <!-- 3. Footer -->
    <footer></footer>

  </body>
</html>
```

#### Important Notes

1. **Required Elements Order**:
   - `<nav></nav>` - Navigation bar placeholder (will be populated by JavaScript)
   - `<div class="main-section">` - Main content wrapper (REQUIRED for sticky footer)
   - `<footer></footer>` - Footer placeholder (will be populated by JavaScript)

2. **CSS Class**: The `.main-section` class is **required** for the sticky footer layout to work correctly

3. **Script Import**: Import `main.js` as a module with `type="module"` to enable navbar and footer rendering

4. **Path Adjustments**: Adjust relative paths (`../../`) based on your file location in the project structure

#### Example for Different Locations

**For root level pages** (like `index.html`):

```html
<link href="./shared/bootstrap/bootstrap.min.css" rel="stylesheet" />
<script type="module" src="./main.js"></script>
```

**For pages in features folder** (like `features/products/products-list.html`):

```html
<link href="../../shared/bootstrap/bootstrap.min.css" rel="stylesheet" />
<script type="module" src="../../main.js"></script>
```
