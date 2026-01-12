# Prompt Evaluation Report

## Metadata

- Date: 2026-01-07 11:10:39.997
- Task slug: improve-order-details-ui-view-edit-modal
- Files changed:
  - src/pages/OrdersPage.tsx

## Original Prompt

```
GOAL
Improve the Order details UI (View/Edit modal content) to display the order response in clearly separated sections with the exact fields specified below.

@Files
- src/pages/OrdersPage.tsx
- src/components/ui/Modal.tsx (only if needed for layout/scrolling)
- src/components/common/DataTable.tsx (only if reused for items table inside modal)
- src/components/ui/Badge.tsx (only if needed for status styling)
- src/utils/format.ts (money + datetime formatting)
- src/types/order.ts (ensure fields are typed correctly)

ACCEPTANCE CRITERIA
- Order details modal layout
  - The modal shows these sections in this order, with section headings:
    1) Order
    2) Customer
    3) Items
    4) Price
    5) Shipping Info
    6) Status
  - The modal is responsive:
    - On mobile: sections stack vertically, labels readable, table scrolls horizontally if needed.
    - On desktop: use a clean 2-column label/value grid where appropriate.

- Section: Order
  - Display these fields:
    - ID (order.id)
    - Order Code (order.orderCode)
    - Created At (order.createdAt)
    - Updated At (order.updatedAt)
  - Use shared datetime formatter for timestamps.
  - If any field is null/undefined, show "—" instead of crashing.

- Section: Customer
  - Display:
    - Customer Name (order.customer.name)
    - Customer Phone (order.customer.phone)
    - Customer Email (order.customer.email)

- Section: Items (as a table)
  - Render a table with columns:
    - Product Name (item.productName)
    - Quantity (item.quantity)
    - Unit Price (item.unitPrice, formatted money)
    - Total Price (item.totalPrice, formatted money)
  - If items is empty, show "No items".

- Section: Price
  - Display:
    - Subtotal (order.pricing.subTotal)
    - Shipping Fee (order.pricing.shippingFee)
    - Discount (order.pricing.discount)
    - Total Amount (order.pricing.totalAmount)
    - Currency (order.pricing.currency)
  - Money fields use shared money formatter.

- Section: Shipping Info
  - Display:
    - Shipping Status (order.shipping.status)
    - Payment Method (order.paymentMethod)
    - Receiver Name (order.shipping.address.receiverName)
    - Receiver Phone (order.shipping.address.receiverPhone)
    - Full Address (order.shipping.address.fullAddress)
  - Safely handle null shipping/shipping.address fields by showing "—".

- Section: Status
  - Display:
    - Order Status (order.orderStatus)
    - Payment Status (order.paymentStatus)
  - Use Badge for statuses where appropriate:
    - Order status: show a badge; handle "cancelled" and other values gracefully.
    - Payment status: show a badge; handle "PENDING" and other values gracefully.
  - No hard crash if status is an unknown string; show it as text.

- Scope control
  - Do not change list/table pagination or existing CRUD flows beyond updating the details modal content/layout.
  - Keep existing behavior for opening/closing modals intact.

OUTPUT
- Unified diff patch only.
```

## 1. Prompt Clarity Score (1-10)

**Score: 10/10**

- Extremely clear goal: improve Order details UI with exact field specifications.
- Acceptance criteria are highly detailed and explicit:
  - Exact section order (1-6) with section headings.
  - Responsive design requirements (mobile vs desktop).
  - Exact fields for each section with field paths (e.g., order.id, order.customer.name).
  - Specific formatting requirements (datetime formatter, money formatter).
  - Null/undefined handling ("—" placeholder).
  - Items table structure (exact columns).
  - Badge usage guidelines (with specific status handling).
  - Scope control (what not to change).
- Files to reference are clearly listed with usage notes.
- Output format is explicitly required (unified diff patch only).
- No ambiguity: every requirement is specific and measurable.

## 2. Context Efficiency

- **@Files provided**: Comprehensive list with usage notes (e.g., "only if needed", "only if reused").
- **Missing context that required minimal guessing**:
  - Section heading styling: inferred to use same uppercase, semibold, gray-700 styling as Product View modal (consistent pattern).
  - Field label styling: inferred to use uppercase, extra-small font, gray-500 (consistent with existing patterns).
  - Grid layout specifics: inferred 2-column grid on sm+ screens, 1 column on mobile (standard responsive pattern).
  - Badge variant mapping: explicitly specified for Order Status (cancelled/failed → error) and Payment Status (PAID → success, PENDING → warning).
  - Items table styling: inferred to use border, rounded corners, overflow-x-auto for horizontal scroll (standard table styling).
  - Null handling format: explicitly specified to use "—" (em dash).
- **Files that would have reduced ambiguity**:
  - None - the prompt was extremely detailed and left no significant ambiguity.

## 3. Safety Analysis

- **Security risks**: None identified in the UI implementation.
- **Privacy risks**: None; order information displayed is business data, not sensitive.
- **Secrets/PII**: No secrets are exposed; customer information is displayed but appropriate for admin interface.
- **Risky patterns**:
  - Comprehensive null/undefined handling prevents crashes when data is missing.
  - Optional chaining (`order.customer?.name`) safely handles nested object access.
  - Items table handles empty arrays gracefully.
  - Badge variant selection handles unknown status values gracefully (defaults to 'default' variant).
  - All money and datetime formatting uses shared utilities, ensuring consistency.
  - No user input is collected in View modal, so no validation concerns.
  - Scope control was explicitly maintained (no changes to pagination or CRUD flows).

## 4. Improved Prompt

```
GOAL
Reorganize Order View details modal to display order information in exactly 6 specified sections with precise field mappings and null-safe handling.

@Files
- src/pages/OrdersPage.tsx        (modify View modal content only)

REFERENCE FILES (for context, do not modify)
- src/components/ui/Modal.tsx       (already handles layout/scrolling correctly)
- src/components/common/DataTable.tsx (not reused - use native table for items)
- src/components/ui/Badge.tsx       (use for status fields)
- src/utils/format.ts               (use formatMoney and formatDateTime)
- src/types/order.ts                (verify field paths match types)

CONSTRAINTS
- Do NOT modify Edit modal content (only View modal).
- Do NOT change list/table pagination.
- Do NOT change existing CRUD flows.
- Keep modal opening/closing behavior intact.
- Use optional chaining for all nested field access.
- Show "—" (em dash) for any null/undefined field values.

ACCEPTANCE CRITERIA
- Modal layout:
  - Sections displayed in exact order: Order, Customer, Items, Price, Shipping Info, Status.
  - Each section has uppercase heading (text-sm, font-semibold, text-gray-700, uppercase, tracking-wide).
  - Responsive: sections stack vertically on mobile, 2-column grid on sm+ screens for field pairs.
  - Items table scrolls horizontally on mobile if needed (overflow-x-auto).
- Section: Order (first section)
  - Fields in 2-column grid:
    - ID: order.id (monospace font, show "—" if null)
    - Order Code: order.orderCode (monospace font, show "—" if null)
    - Created At: order.createdAt (formatDateTime, show "—" if null)
    - Updated At: order.updatedAt (formatDateTime, show "—" if null)
- Section: Customer
  - Fields in 2-column grid:
    - Customer Name: order.customer.name (show "—" if null)
    - Customer Phone: order.customer.phone (show "—" if null)
    - Customer Email: order.customer.email (show "—" if null)
  - Use optional chaining: order.customer?.name
- Section: Items
  - Render as table with border and rounded corners.
  - Columns: Product Name, Quantity, Unit Price, Total Price.
  - Use item.productName (not resolved from products store).
  - Format Unit Price and Total Price with formatMoney.
  - Show "No items" if items array is empty or null.
  - Table scrolls horizontally on mobile (overflow-x-auto wrapper).
- Section: Price
  - Fields in 2-column grid:
    - Subtotal: order.pricing.subTotal (formatMoney, show "—" if null)
    - Shipping Fee: order.pricing.shippingFee (formatMoney, show "—" if null)
    - Discount: order.pricing.discount (formatMoney, show "—" if null)
    - Total Amount: order.pricing.totalAmount (formatMoney, bold, show "—" if null)
    - Currency: order.pricing.currency (show "—" if null)
  - Use optional chaining: order.pricing?.subTotal
- Section: Shipping Info
  - Fields in 2-column grid (Full Address spans 2 columns):
    - Shipping Status: order.shipping.status (Badge component, show "—" if null)
    - Payment Method: order.paymentMethod (text, show "—" if null)
    - Receiver Name: order.shipping.address.receiverName (show "—" if null)
    - Receiver Phone: order.shipping.address.receiverPhone (show "—" if null)
    - Full Address: order.shipping.address.fullAddress (sm:col-span-2, show "—" if null)
  - Use optional chaining: order.shipping?.address?.receiverName
- Section: Status (last section)
  - Fields in 2-column grid:
    - Order Status: order.orderStatus (Badge, error variant for cancelled/failed, default otherwise, show "—" if null)
    - Payment Status: order.paymentStatus (Badge, success for PAID, warning for PENDING, default otherwise, show "—" if null)
  - Handle unknown status strings gracefully (show as Badge with default variant).
- Null safety:
  - All field accesses use optional chaining where appropriate.
  - All null/undefined values display as "—" (em dash character).
  - No crashes on missing nested objects (e.g., order.shipping?.address).

OUTPUT
- Unified diff patch only for src/pages/OrdersPage.tsx
```

