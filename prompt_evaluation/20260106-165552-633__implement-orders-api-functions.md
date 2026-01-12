# Prompt Evaluation Report

## Metadata

- Date: 2026-01-06 16:55:52.633
- Task slug: implement-orders-api-functions
- Files changed:
  - src/types/order.ts
  - src/api/orders.ts
  - src/api/index.ts

## Original Prompt

```
GOAL
Implement backend Orders API functions.

@Files
- src/api/orders.ts
- src/api/http.ts
- src/types/order.ts
- src/api/index.ts

ACCEPTANCE CRITERIA
- Exports: listOrders, createOrder, updateOrder, deleteOrder.
- Uses REST endpoints:
  - GET/POST /orders
  - PUT/DELETE /orders/:id
- Functions are typed with Order and payload types.

OUTPUT
- Unified diff patch only.
```

## 1. Prompt Clarity Score (1-10)

**Score: 9/10**

- Clear goal: implement Orders CRUD backend functions.
- Acceptance criteria specify exact exports, endpoints, and typing requirements.
- Files to touch are clearly listed.
- Output format is explicitly required (unified diff patch only).
- Minor gap: no explicit guidance on the structure of CreateOrderPayload and UpdateOrderPayload (inferred from Order shape).

## 2. Context Efficiency

- **@Files provided**: Sufficient to implement and wire the Orders API (types, HTTP client, API index, and orders module).
- **Missing context that required guessing**:
  - Exact composition of create/update payloads: the prompt did not specify which Order fields belong in payloads vs. server-generated fields (e.g., id, timestamps).
  - Whether updates are partial or full: inferred that UpdateOrderPayload should allow partial updates (all fields optional).
  - Whether create/update payloads should be in `src/types/order.ts` or `src/api/orders.ts`: chose to define them in the types file for reuse.
  - How to handle items in payloads (full OrderItem vs. subset): chose to send a minimal subset (productId, quantity, unitPrice).
- **Files that would have reduced ambiguity**:
  - Backend API documentation for Orders (fields required on create/update, validation rules).
  - Example API module (e.g., an existing products API) to mirror patterns.

## 3. Safety Analysis

- **Security risks**: None identified in the client implementation.
- **Privacy risks**: None; no PII is logged or stored beyond typed structures.
- **Secrets/PII**: No secrets are hardcoded; base URL and auth would be handled elsewhere via environment/config.
- **Risky patterns**:
  - Client trusts the backend to validate order payloads; no additional client-side validation in the API layer.
  - Error handling is delegated to the shared HTTP client (`request<T>`), which centralizes behavior and reduces duplication.

## 4. Improved Prompt

```
GOAL
Implement and wire backend Orders CRUD API functions using the shared HTTP client.

@Files
- src/api/orders.ts        (create or update with full implementations)
- src/api/http.ts          (existing shared HTTP client)
- src/types/order.ts       (define and export payload types)
- src/api/index.ts         (re-export orders API)

CONSTRAINTS
- All network calls must go through request<T> from src/api/http.ts.
- No direct fetch/axios usage in src/api/orders.ts.
- No `any` types; use Order and dedicated payload types.
- Add or reuse CreateOrderPayload and UpdateOrderPayload from src/types/order.ts.
- Add brief JSDoc comments for public functions per project rules.

ACCEPTANCE CRITERIA
- src/api/orders.ts exports:
  - listOrders(): Promise<Order[]>
  - createOrder(payload: CreateOrderPayload): Promise<Order>
  - updateOrder(id: string, payload: UpdateOrderPayload): Promise<Order>
  - deleteOrder(id: string): Promise<void>
- Endpoints and methods:
  - GET /orders
  - POST /orders
  - PUT /orders/:id
  - DELETE /orders/:id
- Payload types:
  - Order defined in src/types/order.ts.
  - CreateOrderPayload and UpdateOrderPayload defined and exported from src/types/order.ts.
- src/api/index.ts re-exports the orders API so imports like `import { listOrders } from "src/api"` resolve.
- The project compiles with no missing-file import errors for the Orders API.

OUTPUT
- Unified diff patch only including:
  - src/types/order.ts
  - src/api/orders.ts
  - src/api/index.ts
```


