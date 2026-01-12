# Prompt Evaluation Report

## Metadata

- Date: 2026-01-07 10:34:27.430
- Task slug: add-order-view-details-modal
- Files changed:
  - src/pages/OrdersPage.tsx

## Original Prompt

```
GOAL
Add Order "View details" modal showing customer/items/pricing/shipping and resolve productId to product name from Products list.

@Files
- src/pages/OrdersPage.tsx
- src/components/ui/Modal.tsx
- src/stores/productsStore.ts
- src/utils/format.ts

ACCEPTANCE CRITERIA
- Clicking "View" opens a modal with readable sections:
  - Customer
  - Items list: product name (from products store) + quantity
  - Pricing (formatted money)
  - Shipping info
  - Status fields
- If a productId is not found, show "Unknown product" but still display the id.
- Modal closes correctly.

OUTPUT
- Unified diff patch only.
```

## 1. Prompt Clarity Score (1-10)

**Score: 9/10**

- Clear goal: add Order View details modal with specific sections and product name resolution.
- Acceptance criteria explicitly specify:
  - Modal sections (Customer, Items list, Pricing, Shipping info, Status fields).
  - Product name resolution from products store.
  - Handling of missing products ("Unknown product" with id).
  - Modal closing behavior.
- Files to reference are clearly listed (though only OrdersPage.tsx was modified).
- Output format is explicitly required (unified diff patch only).
- Minor gap: no explicit guidance on how to structure sections (inferred to use semantic HTML sections with headings, similar to Product View modal).
- Minor gap: no explicit mention of using Badge component for status fields (inferred from ProductsPage pattern).
- Minor gap: no explicit guidance on Items list display format (inferred to use table format for better readability).
- Minor gap: no explicit mention of which shipping fields to display (inferred to show all available shipping information).

## 2. Context Efficiency

- **@Files provided**: Appropriate files listed, though Modal.tsx and format.ts were already implemented correctly and didn't need changes.
- **Missing context that required guessing**:
  - Section organization: inferred to use semantic HTML sections with headings, similar to Product View modal pattern.
  - Items list format: inferred to use table format with columns for Product, Quantity, Unit Price, Total.
  - Customer section fields: inferred to display name, phone, email, customerId in a grid layout.
  - Pricing section fields: inferred to display subtotal, shipping fee, discount, total amount.
  - Shipping section fields: inferred to display address (receiver name, phone, full address), shipping status, shipping order code, shipper info, estimated delivery, delivered at, failed reason.
  - Status section fields: inferred to display order status, payment status, payment method, order code, created, updated.
  - Badge component usage: inferred to use Badge component for status fields (from ProductsPage pattern).
  - Visual layout: inferred to use grid layout for related fields (2 columns on larger screens).
  - Typography hierarchy: inferred to use uppercase labels with smaller font size, and larger text for values.
  - Product name resolution function: inferred to create a helper function `getProductName` that looks up products from store.
  - Missing product handling: explicitly specified to show "Unknown product (productId)" format.
  - Conditional field display: inferred to conditionally show shipping fields only if they have values (e.g., shipper name, estimated delivery, delivered at, failed reason).
- **Files that would have reduced ambiguity**:
  - Design mockup or wireframe showing exact section layout and field organization.
  - Example implementation of similar detail modals (Product View modal was used as reference).
  - Specification of which shipping/status fields are always present vs. conditionally displayed.
  - Style guide for detail view patterns.

## 3. Safety Analysis

- **Security risks**: None identified in the UI implementation.
- **Privacy risks**: None; order information displayed is business data, not sensitive.
- **Secrets/PII**: No secrets are exposed; customer information (name, phone, email) is displayed but appropriate for admin interface.
- **Risky patterns**:
  - All order information is displayed, which is appropriate for an admin interface.
  - Product name resolution gracefully handles missing products without breaking the UI.
  - ProductId is always displayed even when product is not found, which helps with debugging.
  - Modal closing behavior was already implemented correctly in Modal component (close button, backdrop click, Escape key).
  - No user input is collected, so no validation or sanitization concerns.
  - Conditional rendering of shipping fields prevents displaying empty or undefined values.

## 4. Improved Prompt

```
GOAL
Implement Order "View details" modal displaying comprehensive order information with product name resolution from products store.

@Files
- src/pages/OrdersPage.tsx        (implement View modal with all sections)

REFERENCE FILES (for context, do not modify)
- src/components/ui/Modal.tsx       (already handles close button, backdrop, Escape key)
- src/stores/productsStore.ts      (use to resolve productId to product name)
- src/utils/format.ts              (use formatMoney and formatDateTime utilities)
- src/pages/ProductsPage.tsx       (reference for View modal section structure)

CONSTRAINTS
- Modal closing behavior (close button, backdrop click, Escape key) is already implemented in Modal component - do not modify.
- All dates must use formatDateTime utility from src/utils/format.ts.
- All money values must use formatMoney utility from src/utils/format.ts.
- Use semantic HTML elements (<section>, <h3>) for structure, similar to Product View modal.
- Use Badge component for status fields.
- Product name resolution must handle missing products gracefully.

ACCEPTANCE CRITERIA
- Clicking "View" action button opens modal showing all order information.
- Content is organized into logical sections:
  - Customer: name, phone, email, customerId (grid layout)
  - Items: table with columns (Product name, Quantity, Unit Price, Total)
    - Product names resolved from productsStore using productId
    - If product not found, display "Unknown product (productId)"
    - All prices formatted with formatMoney
  - Pricing: subtotal, shipping fee, discount, total amount (grid layout, all formatted with formatMoney)
  - Shipping: address (receiver name, phone, full address), shipping status (Badge), shipping order code, shipper info (if available), estimated delivery (if available), delivered at (if available), failed reason (if available)
  - Status: order status (Badge), payment status (Badge with success variant for PAID), payment method, order code, created date, updated date (all dates formatted with formatDateTime)
- Product name resolution:
  - Create helper function that looks up productId in productsStore
  - Return product name if found
  - Return "Unknown product (productId)" if not found (always include the productId)
- Visual design:
  - Section headings: uppercase, small font, semibold, gray-700
  - Field labels: uppercase, extra-small font, medium weight, gray-500
  - Values: base font size, gray-900
  - Responsive grid layout: 1 column on mobile, 2 columns on sm+ screens
  - Proper spacing between sections (space-y-6)
- Modal closing:
  - Close button in header closes modal (already implemented)
  - Clicking backdrop closes modal (already implemented)
  - Escape key closes modal (already implemented)
  - All closing mechanisms work correctly.

OUTPUT
- Unified diff patch only for src/pages/OrdersPage.tsx
```

