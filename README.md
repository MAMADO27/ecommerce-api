# 🛒 E-Commerce Backend

Backend RESTful API for an E-Commerce application built with **Node.js**, **Express**, and **MongoDB**.  
It includes authentication, product management, order handling, and payment integration.

---

## 🚀 Features

- User authentication (JWT-based)
- Role-based access control (Admin / User)
- Product management (CRUD)
- Categories & Subcategories
- Shopping cart & wishlist
- Orders & order items
- Coupons & discounts
- Payment integration (e.g., Stripe / PayPal)
- Error handling & validation
- RESTful API architecture

---

## 🛠️ Tech Stack

- **Node.js** (Runtime)
- **Express.js** (Web framework)
- **MongoDB + Mongoose** (Database & ODM)
- **JWT** (Authentication)
- **Multer** (Image upload)
- **Stripe / PayPal** (Payments)
- **Validator** (Input validation)

---

## 📂 Project Structure
EcommerceAPI/
│── config/ # DB connection & environment config
│── middleware/ # Auth, error handling, validation middlewares
│── modules/ # Core features (auth, product, order, cart, coupon, etc.)
│── routes/ # API endpoints routes
│── services/ # Business logic services
│── utils/ # Helpers (token, email, sanitize, etc.)
│── app.js # Express app setup

## 👨‍💻 Author
https://github.com/MAMADO27/ecommerce-api
