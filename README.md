# 🛒 E-Commerce RESTful API (Node.js & Express)

## 📌 Overview

This project is a RESTful API for an E-Commerce application built using Node.js, Express, and MongoDB.

⚠️ Note: This project is still in progress and not all features are completed yet.

---

## 🚀 Project Goal

- Practice Backend Development using Node.js
- Build a scalable & secure RESTful API
- Work with MongoDB & Mongoose
- Implement real-world E-Commerce features & security best practices

---

## 🧩 Features

### ✅ Completed

- Express Server Setup
- MongoDB Connection
- CRUD Operations:
  - Categories
  - SubCategories
  - Brands
  - Products
- Validation & Error Handling
- Search, Filter, Sort, Pagination
- Image Upload (Single & Multiple using Multer & Sharp)
- Authentication & Authorization (JWT)
- Password Reset via Email (Nodemailer)
- Reviews & Wishlist
- Coupons System
- Shopping Cart
- Orders & Payments (Stripe Webhook)
- **Security & Data Protection Enhancements**

---


---

## 🛡️ Security Enhancements

To ensure application reliability and protect against common web vulnerabilities, the following security measures have been implemented:

1. **Take Precautions Against Brute-Forcing By Applying RateLimiter**
   - Applied `express-rate-limit` across endpoints to prevent brute-forcing and denial-of-service attempts.
   - **General API**: 100 requests / 15 minutes.
   - **Auth (`/signup`, `/login`)**: 5 attempts / 15 minutes.
   - **Password Reset (`/forgotPassword`)**: 3 attempts / hour.
   - **Reset Code Verification (`/verifyResetCode`)**: 10 attempts / 15 minutes.

2. **Data Sanitization (NoSQL Injection & XSS Protection)**
   - **NoSQL Injection Defense**: Integrated `express-mongo-sanitize` to filter out `$` and `.` operators from incoming requests.
   - **XSS Protection**: Integrated `express-xss-sanitizer` to sanitize HTML/JS scripts from user input.

3. **Return Only Necessary Fields**
   - **Schema-Level Exclusions**: Configured `select: false` on sensitive attributes like `password` and `passwordResetCode` in `userModel`.
   - **Sanitized Response Objects**: Utilized `sanitizeUser()` helper to sanitize user output payload, ensuring only necessary user fields (`_id`, `name`, `email`, `role`, `profileImg`) are exposed to the client.

4. **Prevent HTTP Parameter Pollution (HPP)**
   - Applied `hpp-clean` middleware to prevent HTTP parameter pollution while whitelisting allowed filter params (`price`, `sold`, `quantity`, `ratingsAverage`, `ratingsQuantity`).

5. **Set Request Size Limit**
   - Configured `express.json({ limit: '20kb' })` to restrict incoming JSON payload size and mitigate DoS attack vectors.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **Security & Middleware**: `express-rate-limit`, `@exortek/express-mongo-sanitize`, `express-xss-sanitizer`, `hpp-clean`, `bcryptjs`, `jsonwebtoken`
- **Utilities**: `nodemailer`, `multer`, `sharp`

---

## 📂 Project Structure

```
project/
│
├── config/             # DB & Environment Configuration
├── controllers/        # Route logic handlers
├── middleware/         # Custom & Security Middlewares (Error, RateLimit, etc.)
├── models/             # Mongoose Schemas & Data Models
├── routes/             # API Routes definitions
├── services/           # Business logic & Database interactions
├── utils/              # Helper utilities (Validators, Email, Sanitization, API Features)
└── server.js           # Express App Entry Point
```

---

## ⚙️ Run Locally

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Environment Variables (`.env`)

```env
PORT=8080
NODE_ENV=development
DB_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 3. Run server

```bash
npm run start:dev
```

---

## 📚 Learning Outcomes

- Building RESTful APIs with Clean Architecture
- Handling Authentication & Authorization with JWT
- Comprehensive Data Security & Sanitization
- Error Handling & Input Validation
- Production-Ready Backend Best Practices

---

## 📌 Notes

- This project is part of my learning journey
- It is continuously updated

---

## 👨‍💻 Author

Youssef Mohamed
