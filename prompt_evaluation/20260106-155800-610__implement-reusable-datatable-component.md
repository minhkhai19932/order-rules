# Prompt Evaluation Report

## Metadata

- Date: 2026-01-06 15:58:00.610
- Task slug: implement-reusable-datatable-component
- Files changed:
  - src/components/common/DataTable.tsx (new)
  - src/pages/OrdersPage.tsx
  - src/pages/ProductsPage.tsx

## Original Prompt

```
GOAL
Implement a reusable DataTable component used by Orders and Products list views.

@Files
- src/components/common/DataTable.tsx
- src/pages/OrdersPage.tsx
- src/pages/ProductsPage.tsx
- src/components/common/<existing common example>.tsx

ACCEPTANCE CRITERIA
- Table renders columns/rows with a typed API (no `any`).
- Shows "No data" empty state.
- On small screens, table is horizontally scrollable (responsive).

OUTPUT
- Unified diff patch only.
```

## 1. Prompt Clarity Score (1-10)

**Score: 8/10**

- Clear goal: Create reusable DataTable component
- Good acceptance criteria covering key requirements
- Appropriate @Files list
- Output format specified
- Minor gaps:
  - No specification of column definition structure (header + render function)
  - No mention of row key/id requirement
  - No specification of empty state message customization

## 2. Context Efficiency

- **@Files provided**: All necessary files correctly identified
- **Missing context that required guessing**:
  - Column API design (chose header + render function approach with optional className)
  - Row identification approach (added getRowId function prop)
  - Empty state message customization (made emptyMessage optional with default)
  - How to handle cell styling (added className support to columns)
  - Whether to extract all table logic or just the table element (extracted entire table structure)
- **Files that would have reduced ambiguity**:
  - Design mockups or specifications for table structure
  - Existing table component examples (none existed)
  - Column definition examples or patterns

## 3. Safety Analysis

- **Security risks**: None
- **Privacy risks**: None
- **Secrets/PII**: None present
- **Risky patterns**: None identified
- Component properly uses TypeScript generics for type safety
- No `any` types used
- Row keys properly generated using getRowId function

## 4. Improved Prompt

```
GOAL
Create a reusable DataTable component to replace duplicated table code in Orders and Products pages.

@Files
- src/components/common/DataTable.tsx (create)
- src/pages/OrdersPage.tsx (refactor to use DataTable)
- src/pages/ProductsPage.tsx (refactor to use DataTable)

CONSTRAINTS
- Use TypeScript generics for type safety (no `any` types)
- Column definition should include: header (string), render function (row => ReactNode), optional className
- Component should accept: columns array, data array, getRowId function, optional emptyMessage
- Add English doc comments per project rules

ACCEPTANCE CRITERIA
- DataTable component accepts typed columns and data arrays (generic type T)
- Column definition interface: { header: string, render: (row: T) => ReactNode, className?: string }
- Component shows empty state when data.length === 0 (customizable message)
- Table is wrapped in overflow-x-auto for horizontal scrolling on small screens
- Both OrdersPage and ProductsPage refactored to use DataTable with column definitions
- No `any` types in any file
- No TypeScript or linter errors

OUTPUT
- Unified diff patch format only
- Include DataTable.tsx (new) and both page refactors
```

