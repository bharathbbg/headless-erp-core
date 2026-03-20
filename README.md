# Headless ERP Core for Agentic AI

An API-first ERP system built specifically for testing and developing Multi-Agent Orchestration workflows. 

## 🚀 Overview
This repository contains the foundational core of an industrial ERP, designed to be "Agent-Friendly". It provides clear REST endpoints, consistent JSON response structures, and built-in industrial safety rules to govern high-value AI-driven decisions.

### Key Features
- **Inventory Management:** Track SKUs, stock levels, and reorder points.
- **Procurement System:** Draft and manage Purchase Orders (POs) from pending to approved/received.
- **Multi-Agent Swarm Logic:** Built-in protocol for handoffs between roles (Procurement Officer and Finance Manager).
- **Industrial Safety:** "Human-in-the-Loop" enforcement for transactions > 100,000 INR.
- **Audit Logging:** Comprehensive traceability of every tool call and status change in a centralized `system_logs` collection.

## 🛠 Tech Stack
- **Runtime:** Node.js (LTS)
- **Framework:** Express with TypeScript
- **Database:** MongoDB Atlas (Mongoose)
- **Validation:** Zod (Request/Response safety)

## 🏁 Getting Started

### Prerequisites
- Node.js installed
- A MongoDB Atlas connection string

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

### Running the App
```bash
# Development mode with hot-reload
npm run dev

# Build and Start
npm run build
npm start
```

## 📄 API Documentation
- **Inventory:** `GET /api/inventory`, `PATCH /api/inventory/:sku`
- **Procurement:** 
  - `POST /api/procurement/request` (Draft PO)
  - `GET /api/procurement/pending` (Review POs)
  - `PATCH /api/procurement/:id/status` (Update PO status)
- **Audit:** `GET /api/audit` (Fetch system logs)

---
Developed as part of the **ERP Agentic Orchestration** project.
