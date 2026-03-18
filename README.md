# 🛒 E-Commerce Backend API

A fully-featured RESTful API for an E-Commerce platform built with **Node.js**, **Express**, and **MongoDB**.  
Covers the full shopping flow — from browsing products to placing orders and generating PDF invoices.

---

## 🚀 Features

- 🔑 JWT-based authentication with password reset via email
- 👥 Role-based access control (Admin / Manager / User)
- 🗂️ Categories, subcategories, and brands management
- 📦 Product management with multi-image upload & processing
- ⭐ Reviews & ratings with automatic average recalculation
- 🛒 Shopping cart with coupon/discount support
- ❤️ Wishlist management
- 📍 User address management
- 🧾 Cash & online orders (Stripe Checkout)
- 📄 PDF invoice generation
- 🛡️ Security: rate limiting, HPP protection, NoSQL injection prevention
- 📄 Global error handling (dev & production modes)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT |
| Image Upload | Multer + Sharp |
| Payment | Stripe |
| Email | Nodemailer |
| PDF | PDFKit |
| Validation | express-validator |

---

## 📁 Project Structure

```
├── config/           # Database connection
├── middleware/       # Auth guards, error handler, upload middleware
├── modules/          # Mongoose schemas (User, Product, Order, Cart, ...)
├── routes/           # API route definitions (mounted via index.js)
├── services/         # Business logic
├── utils/
│   ├── validator/    # Input validation rules per resource
│   ├── dummy_data/   # Seed data
│   └── ...           # Helpers (token, email, sanitizer, api_fetchers)
└── app.js            # App entry point
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB instance (local or Atlas)
- Stripe account (for online payments)

### Installation

```bash
git clone https://github.com/MAMADO27/ecommerce-api.git
cd ecommerce-api
npm install
```


---

## 📡 API Endpoints

All endpoints are prefixed with `/api/v1`

### 🔐 Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Register a new user |
| POST | `/auth/login` | Login with email & password |
| POST | `/auth/forgote_password` | Request a password reset code |
| POST | `/auth/verify_reset_code` | Verify the reset code |
| PUT | `/auth/reset_password` | Set a new password |

### 👤 Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/users` | Admin/Manager | Get all users |
| POST | `/users` | Admin/Manager | Create a user |
| GET | `/users/my_data` | User | Get current user profile |
| PUT | `/users/update_my_data` | User | Update profile |
| PUT | `/users/change_my_password` | User | Change password |
| DELETE | `/users/delete_me` | User | Deactivate own account |
| GET | `/users/:id` | Admin/Manager | Get user by ID |
| PUT | `/users/:id` | Admin/Manager | Update user by ID |
| DELETE | `/users/:id` | Admin | Delete user by ID |

### 🗂️ Categories
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/categories` | Public | Get all categories |
| POST | `/categories` | Admin/Manager | Create a category |
| GET | `/categories/:id` | Public | Get category by ID |
| PUT | `/categories/:id` | Admin/Manager | Update category |
| DELETE | `/categories/:id` | Admin | Delete category |
| GET | `/categories/:categoryId/subcategories` | Public | Get subcategories of a category |
| POST | `/categories/:categoryId/subcategories` | Admin/Manager | Create a subcategory under a category |

### 🔖 Subcategories
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/subcategories` | Public | Get all subcategories |
| GET | `/subcategories/:id` | Public | Get subcategory by ID |
| PUT | `/subcategories/:id` | Admin/Manager | Update subcategory |
| DELETE | `/subcategories/:id` | Admin | Delete subcategory |

### 🏷️ Brands
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/brands` | Public | Get all brands |
| POST | `/brands` | Admin/Manager | Create a brand |
| GET | `/brands/:id` | Public | Get brand by ID |
| PUT | `/brands/:id` | Admin/Manager | Update brand |
| DELETE | `/brands/:id` | Admin | Delete brand |

### 📦 Products
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/products` | Public | Get all products (filter, sort, search, paginate) |
| POST | `/products` | Admin/Manager | Create a product (with image upload) |
| GET | `/products/:id` | Public | Get product by ID |
| PUT | `/products/:id` | Admin/Manager | Update product |
| DELETE | `/products/:id` | Admin | Delete product |
| GET | `/products/:productId/reviews` | Public | Get reviews for a product |
| POST | `/products/:productId/reviews` | User | Add a review to a product |

### ⭐ Reviews
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/reviews` | Public | Get all reviews |
| GET | `/reviews/:id` | Public | Get review by ID |
| PUT | `/reviews/:id` | User | Update own review |
| DELETE | `/reviews/:id` | User/Admin/Manager | Delete review |

### 🛒 Cart
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/carts` | User | Get current user's cart |
| POST | `/carts` | User | Add item to cart |
| DELETE | `/carts` | User | Clear cart |
| PUT | `/carts/apply-copon` | User | Apply a coupon code |
| PUT | `/carts/:itemId` | User | Update item quantity |
| DELETE | `/carts/:itemId` | User | Remove item from cart |

### 🎟️ Coupons
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/copons` | Public | Get all coupons |
| POST | `/copons` | Admin/Manager | Create a coupon |
| GET | `/copons/:id` | Public | Get coupon by ID |
| PUT | `/copons/:id` | Admin/Manager | Update coupon |
| DELETE | `/copons/:id` | Admin | Delete coupon |

### 📋 Orders
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/orders` | User/Admin/Manager | Get orders (filtered by user for non-admins) |
| POST | `/orders/:cartId` | User | Create a cash order from cart |
| GET | `/orders/:id` | User/Admin/Manager | Get order by ID |
| PUT | `/orders/:id` | Admin/Manager | Mark order as paid |
| PUT | `/orders/:id/deliver` | Admin/Manager | Mark order as delivered |
| GET | `/orders/checkout-session/:cartId` | User | Get Stripe checkout session |

### ❤️ Wishlist
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/wishlist` | User | Get wishlist |
| POST | `/wishlist` | User | Add product to wishlist |
| DELETE | `/wishlist/:productId` | User | Remove product from wishlist |

### 📍 Addresses
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/adresses` | User | Get saved addresses |
| POST | `/adresses` | User | Add an address |
| DELETE | `/adresses/:adressId` | User | Remove an address |

### 🧾 Invoices
| Method | Endpoint | Description |
|---|---|---|
| GET | `/invoices/:orderId` | Download PDF invoice for an order |

---

## 👨‍💻 Author

**Mohamed** — [@MAMADO27](https://github.com/MAMADO27)  
🔗 [GitHub Repository](https://github.com/MAMADO27/ecommerce-api)