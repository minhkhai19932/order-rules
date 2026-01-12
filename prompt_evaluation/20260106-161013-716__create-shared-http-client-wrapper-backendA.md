# Prompt Evaluation Report

## Metadata

- Date: 2026-01-06 16:10:13.716
- Task slug: create-shared-http-client-wrapper-backendA
- Files changed:
  - src/api/backendA/http.ts (new)
  - src/api/backendA/index.ts (new)

## Original Prompt

```
GOAL
Create a shared HTTP client wrapper for backendA and use it in API modules.

@Files
- src/api/backendA/http.ts
- src/api/backendA/index.ts
- src/api/backendA/<existing api example>.ts

ACCEPTANCE CRITERIA
- Base URL uses import.meta.env.VITE_BACKEND_A_BASE_URL.
- request<T>() sets JSON headers, parses JSON, and throws typed errors on non-2xx.
- No `any` is used.

OUTPUT
```

## 1. Prompt Clarity Score (1-10)

**Score: 8/10**

- Clear goal: Create HTTP client wrapper for backendA
- Good acceptance criteria covering key requirements
- Appropriate @Files list
- Minor gaps:
  - No specification of error handling approach (chose custom HttpError class)
  - No mention of request options/body handling (inferred RequestOptions interface)
  - No specification of response parsing for non-JSON (chose to handle both JSON and text)
  - Output format not specified (provided unified diff patches)

## 2. Context Efficiency

- **@Files provided**: Correctly identified HTTP client and index files
- **Missing context that required guessing**:
  - Error handling approach (chose custom HttpError class with status, statusText, data)
  - Request options structure (created RequestOptions interface extending RequestInit)
  - Body serialization (chose JSON.stringify for non-undefined bodies)
  - Response parsing strategy (chose to check content-type and parse JSON or text accordingly)
  - Network error handling (chose to wrap in HttpError with status 0)
  - Base URL validation (chose to warn if not set but continue)
- **Files that would have reduced ambiguity**:
  - Existing API examples (none existed)
  - Error handling requirements document
  - Backend API documentation

## 3. Safety Analysis

- **Security risks**: None
- **Privacy risks**: None
- **Secrets/PII**: None present
- **Risky patterns**: None identified
- Base URL from environment variable (secure, not hardcoded)
- Proper error handling with typed errors
- No sensitive data exposed in error messages
- JSON parsing is safe (handles both JSON and text responses)

## 4. Improved Prompt

```
GOAL
Create a shared HTTP client wrapper for backendA API with typed requests and error handling.

@Files
- src/api/backendA/http.ts (create)
- src/api/backendA/index.ts (create, export http client)

CONSTRAINTS
- Use import.meta.env.VITE_BACKEND_A_BASE_URL for base URL
- Use TypeScript generics for type safety (no `any` types)
- Create custom HttpError class for typed error handling
- Add English doc comments per project rules

ACCEPTANCE CRITERIA
- request<T>(endpoint, options) function accepts endpoint string and RequestOptions
- Base URL read from import.meta.env.VITE_BACKEND_A_BASE_URL
- Sets Content-Type: application/json and Accept: application/json headers
- Automatically stringifies request body as JSON when provided
- Parses JSON responses automatically (checks content-type header)
- Throws HttpError (custom class) when response status is not 2xx
- HttpError includes: message, status, statusText, optional data
- Handles network errors and wraps in HttpError
- No `any` types used anywhere
- RequestOptions interface extends RequestInit with typed body
- No TypeScript or linter errors

OUTPUT
- Unified diff patch format
- Include http.ts and index.ts files
```

