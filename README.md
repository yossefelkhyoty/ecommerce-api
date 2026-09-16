# 🛒 E-Commerce RESTful API

> A production-ready RESTful API for an E-Commerce application built with **Node.js**, **Express.js**, and **MongoDB**.

---

## 📌 Overview

A full-featured E-Commerce backend API covering the complete shopping lifecycle — from user authentication and product browsing to cart management, coupon discounts, order processing, and Stripe payment integration.

---

## 🚀 Key Features

### 🛍️ Core E-Commerce
- **Categories** — Full CRUD with nested SubCategories
- **Brands & Products** — With image upload (single & multiple), search, filter, sort, and pagination
- **Reviews** — Authenticated users can add/edit/delete reviews with average rating calculation
- **Wishlist** — Add/remove products to personal wishlist
- **Shopping Cart** — Add items, apply coupon discounts, and manage quantities
- **Coupons** — Admin-managed discount codes with expiry dates
- **Orders** — Cash on delivery & online Stripe payment with Webhook support
- **Addresses** — Users can save multiple shipping addresses

### 🔐 Authentication & Authorization
- JWT-based authentication (Access Token)
- Role-based access control (User / Admin)
- Password reset via email with a 6-digit OTP (Nodemailer)
- Secure password hashing with bcryptjs

### 🛡️ Security Enhancements

| Security Measure | Implementation |
|---|---|
| Rate Limiting | `express-rate-limit` — 5 login attempts / 15 min |
| NoSQL Injection | `express-mongo-sanitize` — filters `$` and `.` operators |
| XSS Protection | `express-xss-sanitizer` — sanitizes HTML/JS from input |
| HTTP Param Pollution | `hpp-clean` — with whitelisted filter params |
| Secure HTTP Headers | `helmet` |
| Request Size Limit | `express.json({ limit: '20kb' })` |
| Data Sanitization | `sanitizeUser()` — only exposes necessary user fields |
| Sensitive Field Protection | `select: false` on `password` & `passwordResetCode` |

### 🔍 Advanced Querying
- **Search** — by keyword across name/description
- **Filter** — by price range, ratings, quantity
- **Sort** — by any field (asc/desc)
- **Pagination** — with configurable page size

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose |
| Authentication | JSON Web Token (JWT) |
| Payments | Stripe + Webhook |
| Image Processing | Multer + Sharp |
| Email | Nodemailer (Gmail SMTP) |
| Security | Helmet, Rate Limit, HPP, XSS, Mongo Sanitize |
| Code Quality | ESLint (Airbnb) + Prettier |

---

## 📂 Project Structure

```
ecommerce-api/
│
├── config/             # DB connection & environment setup
├── middleware/         # Error handler, Rate limiters
├── models/             # Mongoose schemas (User, Product, Order, ...)
├── routes/             # API route definitions
├── services/           # Business logic & DB interactions
├── utils/              # Validators, ApiError, ApiFeatures, Email
└── server.js           # App entry point
```

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/ecommerce-api.git
cd ecommerce-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8080
NODE_ENV=development

# MongoDB
DB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRE_TIME=90d

# Email (Gmail)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 4. Run the server

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

---

## 📡 API Endpoints

| Resource | Base URL |
|---|---|
| Auth | `POST /api/v1/auth/signup` · `login` · `forgotPassword` · `verifyResetCode` · `resetPassword` |
| Users | `GET/PATCH /api/v1/users/me` · Admin CRUD `/api/v1/users` |
| Categories | `/api/v1/categories` |
| SubCategories | `/api/v1/categories/:categoryId/subcategories` |
| Brands | `/api/v1/brands` |
| Products | `/api/v1/products` |
| Reviews | `/api/v1/products/:productId/reviews` |
| Wishlist | `/api/v1/wishlist` |
| Addresses | `/api/v1/addresses` |
| Cart | `/api/v1/cart` |
| Coupons | `/api/v1/coupons` |
| Orders | `/api/v1/orders` · Stripe checkout |

---

## 📚 Learning Outcomes

- Designing and building a RESTful API with clean layered architecture
- JWT authentication with role-based access control
- Stripe payment integration with real Webhook handling
- Production-ready security best practices
- Comprehensive input validation and error handling

---

## 👨‍💻 Author

**Youssef Mohamed**