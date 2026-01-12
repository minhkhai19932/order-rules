# Prompt Evaluation Report

## Metadata

- Date: 2026-01-07 10:47:57.227
- Task slug: add-order-create-edit-modal-forms
- Files changed:
  - src/pages/OrdersPage.tsx

## Original Prompt

```
GOAL
Add Order create/edit modal form with product selection sourced from Products list.

@Files
- src/pages/OrdersPage.tsx
- src/components/ui/Modal.tsx
- src/components/ui/Input.tsx
- src/components/ui/Select.tsx
- src/components/ui/Button.tsx
- src/stores/ordersStore.ts
- src/stores/productsStore.ts

ACCEPTANCE CRITERIA
- On Orders page mount, ensure products list exists for product selects (fetch if needed).
- Create modal defaults:
  - pricing.currency default "VND"
  - items starts with one row
- Items editor:
  - Add/remove item rows
  - Each row has productId select (options from products store) and quantity number
  - Show helper text with selected product name and price when available
- Edit modal prefilled from selected order.
- Validation with react-hook-form + zod:
  - customer.name required
  - items length >= 1
  - quantity >= 1
- On successful submit, modal closes and list reflects changes.

OUTPUT
- Unified diff patch only.
```

## 1. Prompt Clarity Score (1-10)

**Score: 9/10**

- Clear goal: add Order create/edit modal forms with product selection.
- Acceptance criteria explicitly specify:
  - Products list fetching on mount (if needed).
  - Create modal defaults (currency "VND", items starts with one row).
  - Items editor requirements (add/remove rows, productId select, quantity, helper text).
  - Edit modal behavior (prefilled from selected order).
  - Validation rules (customer.name required, items length >= 1, quantity >= 1).
  - Success behavior (modal closes, list reflects changes).
- Files to reference are clearly listed (though only OrdersPage.tsx was modified).
- Output format is explicitly required (unified diff patch only).
- Minor gap: no explicit mention that react-hook-form and zod need to be installed (already installed from previous Product forms implementation).
- Minor gap: no explicit guidance on form field layout or structure (inferred to use sections similar to Product forms).
- Minor gap: no explicit mention of shipping address fields (inferred from CreateOrderPayload type).
- Minor gap: no explicit mention of payment method field (inferred from CreateOrderPayload type).
- Minor gap: "pricing.currency default VND" - pricing is not directly editable in form, currency comes from items (inferred to be implicit in payload).

## 2. Context Efficiency

- **@Files provided**: Comprehensive list of files that might be referenced, though only OrdersPage.tsx needed modification.
- **Missing context that required guessing**:
  - Form structure: inferred to use sections (Customer, Items, Shipping Address, Payment) similar to Product forms pattern.
  - Customer fields: inferred to include customerId, name, phone, email from OrderCustomer type.
  - Shipping address fields: inferred to include receiverName, receiverPhone, fullAddress from ShippingAddress type.
  - Payment method field: inferred to use Select component with common payment method options.
  - Items editor UI: inferred to use useFieldArray from react-hook-form for dynamic rows, with border styling for each item row.
  - Helper text format: inferred to show "Product Name - Price" format when product is selected.
  - Auto-population: inferred to auto-populate unitPrice when product is selected (using setValue).
  - Form field layout: inferred to use grid layout for related fields (2 columns on larger screens).
  - Add/remove buttons: inferred to use "+ Add Item" button and delete icon button for each row.
  - Minimum items constraint: inferred to prevent removing the last item (disable remove button when only one item).
  - Currency handling: inferred that currency is implicit in the payload (VND) and doesn't need a form field.
- **Files that would have reduced ambiguity**:
  - Design mockup or wireframe showing exact form layout and items editor structure.
  - Example implementation of similar dynamic form arrays from another part of the application.
  - Specification of payment method options (inferred common values: CASH, CARD, BANK_TRANSFER, E_WALLET).
  - Documentation on form validation patterns for nested objects and arrays.

## 3. Safety Analysis

- **Security risks**: None identified in the form implementation.
- **Privacy risks**: None; order information is business data, not sensitive.
- **Secrets/PII**: No secrets are exposed; customer information (name, phone, email) is collected but appropriate for order management.
- **Risky patterns**:
  - Form validation prevents invalid data from being submitted (customer.name required, items length >= 1, quantity >= 1).
  - Number inputs use `valueAsNumber: true` to properly convert string inputs to numbers for validation.
  - Quantity field uses `.int().min(1)` validation to ensure positive integers.
  - Items array validation ensures at least one item is present.
  - Product selection is restricted to available products from the store.
  - Auto-population of unitPrice from product price helps prevent pricing errors.
  - Form reset on cancel prevents accidental data loss.
  - Async form submission properly handles errors (via store error handling).
  - No client-side sanitization beyond validation (backend should handle sanitization).

## 4. Improved Prompt

```
GOAL
Implement Order create and edit modal forms with product selection, dynamic items management, and validation using react-hook-form and zod.

@Files
- src/pages/OrdersPage.tsx        (implement create/edit forms)

REFERENCE FILES (for context, do not modify)
- src/components/ui/Modal.tsx       (reference - already implemented)
- src/components/ui/Input.tsx      (reference - already implemented)
- src/components/ui/Select.tsx     (reference - already implemented)
- src/components/ui/Button.tsx     (reference - already implemented)
- src/stores/ordersStore.ts        (use createOne and updateOne actions)
- src/stores/productsStore.ts      (use items and fetchList for product selection)
- src/pages/ProductsPage.tsx       (reference for form structure pattern)

DEPENDENCIES
- react-hook-form, zod, and @hookform/resolvers should already be installed (from Product forms).

CONSTRAINTS
- Use react-hook-form for form state management with useFieldArray for items.
- Use zod for schema validation with zodResolver.
- Use Input component for text/number fields.
- Use Select component for dropdown fields.
- Use textarea element for full address field (styled consistently with Input).
- Forms must reset on cancel and after successful submission.
- Modal must close on successful submission and on cancel.
- Products list must be fetched on mount if empty.

ACCEPTANCE CRITERIA
- Products list management:
  - On Orders page mount, check if products list is empty.
  - If empty, call fetchProducts() to ensure products are available for selection.
- Create Order modal:
  - Opens with empty form and default values:
    - customer: { customerId: '', name: '', phone: '', email: '' }
    - items: [{ productId: '', quantity: 1, unitPrice: 0 }] (one row by default)
    - shippingAddress: { receiverName: '', receiverPhone: '', fullAddress: '' }
    - paymentMethod: ''
  - Currency is implicit as "VND" in payload (no form field needed).
  - All fields are editable.
  - Form validation:
    - customer.name: required
    - customer.customerId: required
    - customer.phone: required
    - customer.email: required, valid email format
    - items: array with min length 1
    - items[].productId: required
    - items[].quantity: integer >= 1
    - items[].unitPrice: number >= 0
    - shippingAddress.receiverName: required
    - shippingAddress.receiverPhone: required
    - shippingAddress.fullAddress: required
    - paymentMethod: required
  - On successful submit: calls createOne from store, resets form, closes modal.
  - On cancel: resets form, closes modal.
- Edit Order modal:
  - Opens with form prefilled with selected order values:
    - customer: order.customer
    - items: order.items mapped to { productId, quantity, unitPrice }
    - shippingAddress: order.shipping.address
    - paymentMethod: order.paymentMethod
  - All fields are editable.
  - Same validation rules as create form.
  - On successful submit: calls updateOne from store with order ID, resets form, closes modal.
  - On cancel: resets form, closes modal.
- Items editor:
  - Each item row displays in a bordered container with item number.
  - Each row has:
    - Product select: dropdown with options from products store (shows product names)
    - Quantity input: number field (min 1)
    - Unit Price input: number field (min 0, step 0.01)
  - Helper text below product select: shows "Product Name - Price" when product is selected.
  - Auto-population: when product is selected, unitPrice is automatically set to product price.
  - Add button: "+ Add Item" button adds a new row with default values.
  - Remove button: delete icon button on each row (disabled/hidden when only one item remains).
  - Validation errors displayed inline for each field.
- List updates:
  - After successful create/update, order list automatically refreshes (via store actions).
  - UI reflects changes immediately.

OUTPUT
- Unified diff patch only for src/pages/OrdersPage.tsx
```

