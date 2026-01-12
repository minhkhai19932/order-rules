# Prompt Evaluation Report

## Metadata

- Date: 2026-01-07 11:31:34.448
- Task slug: update-order-modals-shared-content-cancel-button
- Files changed:
  - src/pages/OrdersPage.tsx
  - src/stores/ordersStore.ts
  - src/api/orders.ts

## Original Prompt

```
GOAL
Update the Order modals so View and Edit display the exact same read-only order + shipping details UI, and Edit additionally includes a "Cancel Order" button that PATCHes orderStatus=CANCELLED, then refreshes the orders list.

@Files
- src/pages/OrdersPage.tsx
- src/stores/ordersStore.ts
- src/api/backendA/orders.ts (or src/api/orders.ts depending on the repo)
- src/types/order.ts
- src/components/ui/Modal.tsx (only if footer/actions layout needs adjustment)
- src/components/ui/ConfirmDialog.tsx (if available; reuse for cancel confirmation)

ACCEPTANCE CRITERIA
- Shared modal content
  - View modal and Edit modal render the same detail sections and fields (Order / Customer / Items table / Price / Shipping Info / Status).
  - No editable inputs are introduced; the details are read-only in both modes.

- Edit-only cancel action
  - The Edit modal footer contains an additional button: "Cancel Order".
  - The button is enabled ONLY when the order is cancellable:
    - orderStatus is PENDING (case-insensitive) AND orderCode exists.
  - For non-PENDING statuses, the Cancel Order button is disabled.

- Cancel behavior
  - Clicking "Cancel Order" asks for confirmation (reuse existing ConfirmDialog if present; otherwise a simple in-modal confirmation is acceptable).
  - On confirm:
    - Call the API function updateOrder (PATCH) with the identifier used by the current API (id or orderCode per existing implementation in the repo).
    - The PATCH request body must send ONLY:
      { "orderStatus": "CANCELLED" }
      (use exactly "CANCELLED" as requested)
  - While request is in-flight:
    - Disable the Cancel Order button and show a loading state (button text "Cancelling…" or spinner if exists).
  - On success:
    - Close the modal.
    - Trigger ordersStore.fetchList() so the orders table refreshes and shows the updated status.
  - On failure:
    - Keep modal open and show an error message (use existing error display conventions).

- API/store wiring
  - If updateOrder currently uses PUT, switch it to PATCH.
  - ordersStore must expose an action used by the UI (e.g. cancelOrder or updateStatus) that performs the PATCH then refreshes list (or the UI calls fetchList after awaiting).
  - Components must use selector-based subscriptions to Zustand (no whole-store subscribe).
  - No `any` introduced; TypeScript typecheck passes.

OUTPUT
- Unified diff patch only.
```

## 1. Prompt Clarity Score (1-10)

**Score: 9/10**

- Clear goal: unify View/Edit modals with read-only content and add Cancel Order functionality.
- Detailed acceptance criteria covering:
  - Shared modal content requirements (exact sections listed).
  - Cancel button behavior (enabled condition explicitly stated: PENDING status case-insensitive + orderCode exists).
  - Cancel flow (confirmation → PATCH → loading → success/error handling).
  - API/store requirements (PATCH method, store action, selector-based subscriptions).
- Specific technical details:
  - Exact payload format: `{ "orderStatus": "CANCELLED" }`.
  - Loading state text: "Cancelling…".
  - Error handling: keep modal open, show error.
- Minor ambiguity:
  - "id or orderCode per existing implementation" - needed to check which identifier the API uses (it was `id`).
  - "existing error display conventions" - needed to infer from existing code (red error box pattern).

## 2. Context Efficiency

- **@Files provided**: Comprehensive list with usage notes (e.g., "only if footer/actions layout needs adjustment", "if available; reuse").
- **Missing context that required minimal guessing**:
  - API identifier: checked existing `updateOrder` implementation to confirm it uses `id` (not `orderCode`).
  - Error display pattern: inferred from existing error display in OrdersPage (red background box with error message).
  - Button placement in footer: inferred to add Cancel Order button alongside Close button.
  - Loading state implementation: used button disabled state + text change ("Cancelling…").
  - Confirmation dialog message: inferred to include orderCode in message for clarity.
- **Files that would have reduced ambiguity**:
  - None significant - the prompt was very detailed and the codebase patterns were clear.

## 3. Safety Analysis

- **Security risks**: None identified.
  - Cancel action is a status update operation, appropriate for admin interface.
  - PATCH request only updates orderStatus field, no user input validation concerns.
- **Privacy risks**: None; order information displayed is business data appropriate for admin interface.
- **Secrets/PII**: No secrets exposed; customer information is displayed but appropriate for admin context.
- **Risky patterns**:
  - Case-insensitive status comparison (`orderStatus?.toLowerCase() === 'pending'`) safely handles variations.
  - Optional chaining (`order?.orderCode`) prevents crashes on missing data.
  - Error handling: errors are caught and displayed, preventing unhandled promise rejections.
  - Loading state prevents duplicate requests (button disabled during request).
  - Confirmation dialog prevents accidental cancellations.
  - Store action throws error on failure, allowing UI to handle it appropriately.
  - TypeScript types ensure type safety (no `any` introduced).

## 4. Improved Prompt

```
GOAL
Unify Order View and Edit modals to display identical read-only order details, and add Cancel Order action to Edit modal that updates orderStatus to CANCELLED via PATCH.

@Files
- src/pages/OrdersPage.tsx        (modify View/Edit modals, add cancel action)
- src/stores/ordersStore.ts        (add cancelOrder action)
- src/api/orders.ts                (change updateOrder from PUT to PATCH)

REFERENCE FILES (for context, do not modify)
- src/types/order.ts               (verify orderStatus type)
- src/components/ui/Modal.tsx      (footer layout already supports multiple buttons)
- src/components/ui/ConfirmDialog.tsx (reuse for cancel confirmation)

CONSTRAINTS
- View and Edit modals must render identical read-only content (no editable inputs).
- Cancel Order button appears ONLY in Edit modal footer.
- Button enabled condition: order.orderStatus?.toLowerCase() === 'pending' && order.orderCode exists.
- PATCH payload must be exactly: { "orderStatus": "CANCELLED" } (string literal).
- Use order.id (not orderCode) as API identifier (per existing updateOrder implementation).
- On cancel success: close modal and refresh list.
- On cancel failure: keep modal open, show error message in red box above content.

ACCEPTANCE CRITERIA
- Shared modal content:
  - Extract order details rendering into reusable component/function (OrderDetailsContent).
  - Both View and Edit modals use this component.
  - Sections displayed: Order, Customer, Items (table), Price, Shipping Info, Status.
  - All fields are read-only (no Input/Select components in details view).
- Edit modal footer:
  - Contains "Close" button (replaces "Cancel" button from old form).
  - Contains "Cancel Order" button (only when cancellable).
  - Cancel Order button disabled when: orderStatus !== 'PENDING' (case-insensitive) OR orderCode missing.
  - Cancel Order button shows "Cancelling…" text and is disabled during request.
- Cancel flow:
  - Click Cancel Order → opens ConfirmDialog with danger variant.
  - ConfirmDialog message: "Are you sure you want to cancel order {orderCode}? This action cannot be undone."
  - On confirm: call cancelOrder(order.id) from store.
  - Store action: PATCH /orders/{id} with body { "orderStatus": "CANCELLED" }, then fetchList().
  - On success: close Edit modal and confirmation dialog, list refreshes automatically.
  - On failure: keep modal open, display error in red box (same pattern as existing error display).
- API/store changes:
  - Change updateOrder method from PUT to PATCH in src/api/orders.ts.
  - Add cancelOrder(id: string) action to ordersStore that:
    - Calls updateOrder(id, { orderStatus: "CANCELLED" }).
    - Calls fetchList() after success.
    - Throws error on failure (so UI can catch and display).
  - Use selector-based Zustand subscriptions (e.g., `useOrdersStore((state) => state.cancelOrder)`).
- Type safety:
  - No `any` types introduced.
  - All function parameters and return types explicitly typed.
  - TypeScript compilation passes.

OUTPUT
- Unified diff patch only for modified files.
```

