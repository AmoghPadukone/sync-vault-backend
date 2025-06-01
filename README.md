 
# 🧠 SyncVault Backend Server

This is the **backend powerhouse** for the SyncVault platform — a privacy-first, multi-cloud orchestration service. Built for speed, clarity, and control, the backend provides secure REST APIs, user authentication, file operations, and metadata handling across various storage providers.

---

## 🧱 Tech Stack

| Layer        | Tech Used                          |
|--------------|------------------------------------|
| Framework    | Express (TypeScript)               |
| ORM          | Prisma                             |
| Auth         | JWT + Bcrypt                       |
| Validation   | Zod                                |
| API Docs     | Swagger (via swagger-jsdoc)        |
| Dev Tools    | ts-node-dev, ESLint, Prettier, Jest|

---

## ⚙️ Features

- 🔐 **JWT Authentication** (with Bcrypt password hashing)
- 🗂️ **File Uploads & Metadata Parsing** using `multer`
- 🧼 **Zod-based request validation** for safety and clarity
- 📆 **Day.js** utilities for date manipulation
- 📦 **Modular architecture** with strong TypeScript support
- 📊 **Swagger**-powered API docs for easy integration
- 🧪 **Jest + Supertest** test setup out of the box
- 🔁 **LRU caching** support (e.g., for session optimization or storage metadata)

---

## 📁 Folder Structure

```plaintext
src/
├── index.ts            # Entry point
├── routes/             # Express routers
├── controllers/        # Request handlers
├── services/           # Business logic
├── middlewares/        # Auth, error handling, validation
├── utils/              # Helpers and utilities
├── config/             # Env config, constants
└── prisma/             # DB schema and client
````

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-org/syncvault-backend.git
cd syncvault-backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the root:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
DATABASE_URL=postgresql://user:password@host:port/dbname
```

### 3. Run in Dev Mode

```bash
npm run dev
```

---

## 🧪 Running Tests

```bash
npm run test
```

Includes:

* Unit tests (services, utils)
* Integration tests (routes via Supertest)

---

## 🧰 Dev Scripts

| Script                | Description                  |
| --------------------- | ---------------------------- |
| `npm run dev`         | Start with hot-reloading     |
| `npm run build`       | Compile TypeScript           |
| `npm start`           | Run compiled JS with Nodemon |
| `npm run test`        | Run Jest test suite          |
| `npm run lint`        | Lint project with ESLint     |
| `npm run format`      | Format code with Prettier    |
| `npm run check-types` | Type check only              |

---

## 📚 API Documentation

Visit `/api-docs` when the server is running to explore the Swagger UI.

> Example: `http://localhost:5000/api-docs`

---

## 🛡 Security Considerations

* 🔐 JWT secret is stored in `.env`
* 🧂 Passwords hashed with Bcrypt (12+ salt rounds)
* 🧰 Zod validation for strong payload guarding
* 🧵 Middleware-level error handling with `express-async-handler`

---
 

 
## 🤝 Contributing

We're open to contributions! Please fork the repo, make changes in a branch, and open a PR. For more details, check `CONTRIBUTING.md`.

---

## 📄 License

MIT © 2025 SyncVault Team

```

 
