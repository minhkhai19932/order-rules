# Prompt Evaluation Report

## Metadata

- Date: 2026-01-07 09:28:58.386
- Task slug: implement-orders-zustand-store
- Files changed:
  - src/stores/ordersStore.ts
  - src/pages/OrdersPage.tsx

## Original Prompt

```
GOAL
Implement Orders Zustand store and wire it to Orders UI.

@Files
- src/stores/ordersStore.ts
- src/pages/OrdersPage.tsx

ACCEPTANCE CRITERIA
- Store state: items, loading, error.
- Actions: fetchList, createOne, updateOne, deleteOne.
- OrdersPage uses selectors (no whole-store subscription).
- UI updates after create/update/delete and after refresh.

OUTPUT
- Patch only
```

## 1. Prompt Clarity Score (1-10)

**Score: 9/10**

- Clear goal: implement Zustand store for Orders and integrate with UI.
- Acceptance criteria explicitly specify store state structure (items, loading, error).
- Actions are clearly listed (fetchList, createOne, updateOne, deleteOne).
- Important constraint about selectors (no whole-store subscription) is explicitly stated.
- UI update requirement is clear (after create/update/delete and refresh).
- Files to touch are clearly listed.
- Output format is explicitly required (patch only).
- Minor gap: no explicit guidance on error handling UI (error display was inferred and added based on ProductsPage pattern).
- Minor gap: no explicit mention of loading state UI (loading indicator was inferred and added based on ProductsPage pattern).

## 2. Context Efficiency

- **@Files provided**: Sufficient to implement the store and wire it to the page (store file and page file).
- **Missing context that required guessing**:
  - Whether to show loading/error UI in OrdersPage: inferred that loading and error states should be displayed to users, following the same pattern as ProductsPage.
  - When to fetch data: inferred that `fetchList` should be called on component mount via `useEffect`.
  - Store structure details: inferred that the store should use Zustand's `create` function with state and actions pattern, mirroring the Products store.
  - Whether actions should refresh the list automatically: inferred that create/update/delete should refresh the list to keep UI in sync, following Products store pattern.
  - Whether to include a `resetError` action: added for completeness and consistency with Products store, though not explicitly requested.
  - Import paths for types and API: inferred from existing project structure (types from `../types/order`, API from `../api/orders`).
  - Error message formatting: inferred to use user-friendly error messages derived from caught errors.
- **Files that would have reduced ambiguity**:
  - Example Zustand store (`src/stores/productsStore.ts`) was available and used as a reference pattern.
  - Zustand store rules/conventions from `.cursor/rules/30-zustand.mdx` (already available in project).
  - API module structure (`src/api/orders.ts`) was already implemented and available.
  - ProductsPage implementation served as a good reference for UI integration patterns.

## 3. Safety Analysis

- **Security risks**: None identified in the store implementation.
- **Privacy risks**: None; no PII is logged or stored beyond typed Order structures.
- **Secrets/PII**: No secrets are hardcoded; API calls use the shared HTTP client which handles base URL via environment variables.
- **Risky patterns**:
  - Store actions refresh the entire list after mutations, which is safe but could be optimized for large lists (not a concern for this use case).
  - Error messages are derived from caught errors and stored in state; no sensitive data is exposed.
  - Loading state management prevents race conditions by setting loading before async operations.
  - The implementation follows the same safe patterns as the Products store, ensuring consistency.

## 4. Improved Prompt

```
GOAL
Implement a Zustand store for Orders management and integrate it with OrdersPage UI.

@Files
- src/stores/ordersStore.ts        (create Zustand store with state and actions)
- src/pages/OrdersPage.tsx         (wire store to UI using selectors)

CONSTRAINTS
- Store must use Zustand's `create` function.
- OrdersPage must use selectors (e.g., `useOrdersStore((state) => state.items)`) to avoid whole-store subscriptions.
- All API calls must use functions from `src/api/orders.ts`.
- Store actions should refresh the list after create/update/delete to keep UI in sync.
- Follow Zustand conventions from `.cursor/rules/30-zustand.mdx`.
- Mirror the pattern used in `src/stores/productsStore.ts` for consistency.

ACCEPTANCE CRITERIA
- Store state:
  - `items: Order[]` - array of orders
  - `loading: boolean` - loading state for async operations
  - `error: string | null` - error message or null
- Store actions:
  - `fetchList(): Promise<void>` - fetches orders list and updates state
  - `createOne(payload: CreateOrderPayload): Promise<void>` - creates order and refreshes list
  - `updateOne(id: string, payload: UpdateOrderPayload): Promise<void>` - updates order and refreshes list
  - `deleteOne(id: string): Promise<void>` - deletes order and refreshes list
  - `resetError(): void` - clears error state (optional but recommended for consistency)
- OrdersPage integration:
  - Uses selectors to subscribe to specific store slices (items, loading, error, actions).
  - Calls `fetchList` on component mount via `useEffect`.
  - Displays loading state when `loading === true` and list is empty.
  - Displays error message when `error !== null`.
  - Delete action uses `deleteOne` from store.
  - UI updates automatically after create/update/delete operations (via list refresh).
- Type safety:
  - No `any` types.
  - Uses Order, CreateOrderPayload, UpdateOrderPayload from `src/types/order.ts`.
  - Store is fully typed with TypeScript interfaces.

OUTPUT
- Unified diff patch only including:
  - src/stores/ordersStore.ts
  - src/pages/OrdersPage.tsx
```

