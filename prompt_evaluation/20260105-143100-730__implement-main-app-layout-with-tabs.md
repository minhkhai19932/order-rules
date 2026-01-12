# Prompt Evaluation Report

## Metadata

- Date: 2026-01-05 14:31:00.730
- Task slug: implement-main-app-layout-with-tabs
- Files changed:
  - src/layouts/AppLayout.tsx (new)
  - src/routes/AppRoutes.tsx

## Original Prompt

```
GOAL
Implement the main app layout with two tabs: Orders and Products.

@Files
- src/layouts/AppLayout.tsx
- src/routes/AppRoutes.tsx
- src/components/ui/Button.tsx (if exists)
- src/pages/<existing page example>.tsx

ACCEPTANCE CRITERIA
- Top navigation shows "Shop Admin" and two tabs: "Orders", "Products".
- Active tab is visually highlighted with orange accent.
- Layout is responsive (tabs usable on mobile).
- Pages render inside the layout.

OUTPUT
- Unified diff patch only.
```

## 1. Prompt Clarity Score (1-10)

**Score: 9/10**

- Clear goal: Implement layout with tabs
- Explicit acceptance criteria covering all requirements
- Good @Files list, though Button.tsx didn't exist (not needed)
- Output format specified (patch only)
- Minor gap: No mention of using React Router's NavLink vs Link, or nested route pattern

## 2. Context Efficiency

- **@Files provided**: Correctly identified layout and routes files
- **Missing context that required guessing**:
  - Whether to use NavLink (for active state) or Link (chose NavLink for built-in active state)
  - Exact styling approach for active tab (used orange brand colors with border-bottom)
  - Layout structure pattern (used Outlet for nested routes)
  - Whether Button component was needed (not needed, used NavLink directly)
- **Files that would have reduced ambiguity**:
  - `src/routes/AppRoutes.tsx` (to see current route structure)
  - `src/pages/OrdersPage.tsx` (to understand page structure)
  - Any existing layout examples (none existed)

## 3. Safety Analysis

- **Security risks**: None
- **Privacy risks**: None
- **Secrets/PII**: None present
- **Risky patterns**: None identified
- Code follows security best practices (no sensitive data, proper semantic HTML with aria-label)

## 4. Improved Prompt

```
GOAL
Create a main application layout component with tab navigation for Orders and Products pages.

@Files
- src/layouts/AppLayout.tsx (create)
- src/routes/AppRoutes.tsx (current structure)
- src/pages/OrdersPage.tsx (to understand page structure)

CONSTRAINTS
- Use React Router's NavLink for tab navigation (built-in active state)
- Use nested routes pattern (AppLayout wraps routes, pages render via Outlet)
- Active tab styling: orange brand colors (bg-brand-50, text-brand-700, border-brand-500)
- Responsive: mobile-friendly spacing (px-3 py-2 on mobile, px-4 py-2 on desktop)
- Header should include "Shop Admin" title and tab navigation

ACCEPTANCE CRITERIA
- Header displays "Shop Admin" title
- Two tabs visible: "Orders" and "Products"
- Active tab highlighted with orange accent (background, text color, bottom border)
- Tabs are clickable and navigate correctly
- Layout is responsive (tabs usable on mobile devices)
- Pages render inside the layout (not replacing it)
- No console errors or TypeScript errors

OUTPUT
- Unified diff patch format only
- Include AppLayout.tsx (new) and AppRoutes.tsx (modified)
```

