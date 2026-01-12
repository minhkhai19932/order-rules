# Prompt Evaluation Report

## Metadata

- Date: 2026-01-05 15:02:02.018
- Task slug: create-shared-formatting-utilities-money-datetime
- Files changed:
  - src/utils/format.ts (new)
  - src/pages/OrdersPage.tsx
  - src/pages/ProductsPage.tsx

## Original Prompt

```
GOAL
Create shared formatting utilities for money and datetime and use them in tables.

@Files
- src/utils/format.ts
- src/pages/OrdersPage.tsx
- src/pages/ProductsPage.tsx
- src/utils/<existing util example>.ts

ACCEPTANCE CRITERIA
- formatMoney formats VND and other currencies reasonably.
- formatDateTime handles undefined/null safely.
- Orders and Products tables use the formatters.

OUTPUT
- Patch only.
```

## 1. Prompt Clarity Score (1-10)

**Score: 8/10**

- Clear goal: Create formatting utilities for money and datetime
- Good acceptance criteria covering key requirements
- Appropriate @Files list
- Output format specified
- Minor gaps:
  - No specification of exact VND formatting (no decimals vs decimals)
  - No specification of datetime format preference
  - Mentioned "use them in tables" but didn't specify that tables needed to be created (they didn't exist yet)

## 2. Context Efficiency

- **@Files provided**: Correctly identified utility file and pages to update
- **Missing context that required guessing**:
  - VND formatting style (chose no decimals with ₫ symbol, Vietnamese locale)
  - Other currency formatting (chose 2 decimals with currency symbols)
  - DateTime format preference (chose readable locale format: "Jan 5, 2026, 2:30 PM")
  - Placeholder for invalid dates (chose "-")
  - Table structure and columns (created comprehensive tables with relevant fields)
  - Whether tables existed (they didn't, so created them)
- **Files that would have reduced ambiguity**:
  - Any existing formatting utility examples (none existed)
  - Design mockups or specifications for table layout
  - Currency formatting requirements document

## 3. Safety Analysis

- **Security risks**: None
- **Privacy risks**: None
- **Secrets/PII**: None present
- **Risky patterns**: None identified
- Formatting functions properly handle edge cases (null/undefined, invalid dates)
- No user input sanitization needed (functions only format provided values)

## 4. Improved Prompt

```
GOAL
Create shared formatting utility functions for money and datetime values, and integrate them into Orders and Products table displays.

@Files
- src/utils/format.ts (create)
- src/pages/OrdersPage.tsx (update to add table with formatters)
- src/pages/ProductsPage.tsx (update to add table with formatters)

CONSTRAINTS
- formatMoney: VND should display without decimals (e.g., "1,000,000 ₫"), other currencies with 2 decimals
- formatDateTime: Return "-" for null/undefined/invalid dates
- Use TypeScript with proper type annotations
- Add English doc comments per project rules

ACCEPTANCE CRITERIA
- formatMoney(amount, currency) formats VND correctly (no decimals, ₫ symbol)
- formatMoney handles other currencies reasonably (USD, EUR, etc. with 2 decimals)
- formatDateTime(dateTime) returns "-" for undefined/null/invalid dates
- formatDateTime formats valid dates in readable format
- OrdersPage displays orders in a table using formatMoney and formatDateTime
- ProductsPage displays products in a table using formatMoney and formatDateTime
- Tables are responsive (overflow-x-auto for mobile)
- No TypeScript or linter errors

OUTPUT
- Unified diff patch format only
- Include format.ts (new) and both page updates
```

