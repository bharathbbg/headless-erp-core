# Project: Headless ERP Core for Agentic AI
**Role:** Senior Full-Stack Architect & AI Systems Integrator
**Context:** Building a foundational ERP system to test Multi-Agent Orchestration. 

## 1. Architectural Vision
The ERP must be **Headless (API-First)**. 
- No front-end is required in this phase.
- Every business logic must be exposed via a clean REST API.
- The API must be "Agent-Friendly": Precise HTTP status codes, consistent JSON structures, and descriptive error messages.

## 2. Technical Stack
- **Runtime:** Node.js (LTS)
- **Framework:** Express with TypeScript
- **Database:** MongoDB Atlas (Mongoose)
- **Validation:** Zod (for request/response safety)
- **Environment:** Ubuntu/WSL

## 3. Data Schema Definitions (Phase 1)
Implement the following collections in MongoDB:

### A. Inventory (`products`)
- `sku`: String (Unique)
- `name`: String
- `currentStock`: Number
- `reorderLevel`: Number
- `unitPrice`: Number
- `currency`: String (Default: INR)

### B. Procurement (`purchase_orders`)
- `vendorId`: String
- `items`: Array of { productId, quantity, price }
- `status`: Enum [PENDING_APPROVAL, APPROVED, REJECTED, ORDERED, RECEIVED]
- `totalAmount`: Number

## 4. Required API Endpoints
- **Inventory:** GET /api/inventory, PATCH /api/inventory/:sku (Stock updates)
- **Procurement:** POST /api/procurement/request, GET /api/procurement/pending, PATCH /api/procurement/:id/status

## 5. Implementation Rules
1. Use **Mongoose** for schema definitions.
2. Implement a centralized error-handling middleware.
3. Use environment variables for the MongoDB Atlas connection string.
4. All responses must be wrapped in a standard object: `{ success: boolean, data: any, error?: string }`.

# Project: ERP Agentic Orchestration (Phase 2 & 3)
**Status:** ERP Core (Inventory/Procurement) Complete.
**Goal:** Implement Multi-Agent Swarm for "Auto-Procurement" Workflow.

## Phase 2: The Agentic Bridge (ERP MCP Server)
Build a new MCP Server that wraps the Headless ERP API.

### Tools to Expose:
- `check_low_stock`: Returns a list of products where `currentStock <= reorderLevel`.
- `fetch_vendor_quotes`: Simulates fetching prices for a SKU.
- `draft_purchase_order`: POSTs a PENDING_APPROVAL order to the ERP.
- `list_pending_approvals`: GETs all POs requiring manager intervention.
- `approve_po`: PATCHes a PO status to 'APPROVED'.

## Phase 3: The Multi-Agent Swarm Logic
We will define two distinct Agent Personas and a "Handoff" protocol.

### Agent 1: The "Procurement Officer" (The Worker)
- **Objective:** Ensure stock never runs out.
- **Workflow:** 1. Periodically (or on-demand) call `check_low_stock`.
    2. For each low item, call `fetch_vendor_quotes`.
    3. Call `draft_purchase_order`.
    4. Notify the "Manager Agent" via a shared context/log.

### Agent 2: The "Finance Manager" (The Approver)
- **Objective:** Manage budget and risk.
- **Workflow:**
    1. Call `list_pending_approvals`.
    2. Review the `totalAmount`.
    3. Use internal "Budget Rules" (e.g., "Auto-approve if < 50,000 INR").
    4. Call `approve_po` or `reject_po`.

## Phase 4: Industrial Safety & Auditing
- **Human-in-the-Loop:** For orders > 100,000 INR, the Agent must pause and ask for Bharath's manual confirmation.
- **Audit Log:** Every tool call must be logged in a `system_logs` collection in MongoDB Atlas, identifying *which* agent made the call.