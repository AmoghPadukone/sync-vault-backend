project-root/
├── src/
│ ├── config/ # .env, logger, DB config
│ ├── controllers/ # Route handlers
│ ├── middlewares/ # Error handler, auth, etc.
│ ├── routes/ # API route definitions
│ ├── services/ # Business logic
│ ├── plugins/ # Swagger, cors, rate limiter
│ ├── db/ # Prisma client wrapper
│ ├── types/ # DTOs, extended Express types
│ └── app.ts # Express app setup
├── prisma/ # Prisma schema + seed
│ ├── schema.prisma
│ └── seed.ts
├── tests/ # Jest test cases
├── .env # Environment variables
├── .gitignore
├── tsconfig.json
├── jest.config.js
├── package.json
└── README.md
