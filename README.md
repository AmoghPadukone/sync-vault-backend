 
 # Nubilo SDK 🚀

**Nubilo SDK** is a blazing-fast, modular SDK built to simplify multi-cloud interactions across major providers like **AWS, Google Cloud, Azure**, and more — all through a unified, developer-friendly interface.

## ✨ Why Nubilo?

Managing cloud interactions should be simple, consistent, and vendor-agnostic. Nubilo brings clarity and power to cloud operations with:
- ⚙️ **Unified API** to abstract away provider-specific complexities.
- 🧩 **Modular architecture** so you only import what you need.
- 🔐 **Built-in security and logging** to track actions and protect sensitive operations.
- 📦 **Pluggable design** to easily add support for new providers or services.

---

## 📐 Architecture Overview

The Nubilo SDK is built around a **core-provider-plugin** model:

```plaintext
+------------------------+
|      Nubilo Core       |
|  (Common Interfaces,   |
|   Utils, Errors, etc)  |
+----------+-------------+
           |
     +-----+------+
     |            |
+----v----+   +---v-----+   ... more
| AWS SDK |   | GCP SDK |   providers
+---------+   +---------+
````

### 🔧 Key Modules:

| Module           | Description                                                            |
| ---------------- | ---------------------------------------------------------------------- |
| `@nubilo/core`   | Contains base interfaces, error handlers, utilities, and shared types. |
| `@nubilo/aws`    | AWS-specific implementation for storage, compute, etc.                 |
| `@nubilo/gcp`    | GCP-specific SDK plug with full API coverage.                          |
| `@nubilo/azure`  | Azure plugin module (in progress).                                     |
| `@nubilo/logger` | Built-in logger for all operations.                                    |
| `@nubilo/types`  | Shared type contracts for consistency across clouds.                   |

---

## 🚀 Getting Started

### 1. Install the Core and a Provider Plugin

```bash
npm install @nubilo/core @nubilo/aws
```

### 2. Example Usage

```ts
import { NubiloAWS } from '@nubilo/aws';

const aws = new NubiloAWS({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});

const buckets = await aws.storage.listBuckets();
console.log(buckets);
```

---

## ⚡ Features

* 📦 Plug-and-play support for AWS, GCP, and Azure
* 🛠 Standardized API across cloud platforms
* 🔒 Secure credentials and request signing
* 🧪 Fully typed (TypeScript) with strong IDE support
* 📊 Logging and metrics ready

---

## 🔌 Plugin System

Want to add your own provider or service? Just implement the required interfaces from `@nubilo/core` and register it.

```ts
class MyCustomProvider implements StorageAdapter {
  async listBuckets() { ... }
  async uploadFile() { ... }
}
```

---

## 🧪 Testing & Dev

```bash
# Run unit tests
npm run test

# Build SDK
npm run build
```

---

## 📚 Documentation

> Full docs available soon at [https://nubilo.dev](https://nubilo.dev)

---

## 📍 Roadmap

* [x] AWS support
* [x] GCP support
* [ ] Azure plugin
* [ ] CLI Tool
* [ ] Cost Estimation API
* [ ] SyncVault Integration

---

## 💬 Contributing

We welcome PRs, suggestions, and feedback! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📄 License

MIT © 2025 Nubilo Team
 ```

 