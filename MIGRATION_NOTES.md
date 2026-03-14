# API Refactor – Migration Notes

> Completed: March 2026  
> Scope: Full frontend ↔ ASP.NET backend contract alignment

---

## New files

| File | Purpose |
|------|---------|
| `src/shared/utils/normalizeApiError.ts` | Single error-normalizer for every backend error shape |
| `src/shared/utils/validationSchemas.ts` | Zod schemas mirroring backend validators (install: `zod`) |
| `src/shared/services/api/authApi.ts` | Typed HTTP wrappers for `/api/auth/*` |
| `src/shared/services/api/categoriesApi.ts` | Typed HTTP wrappers for `/api/categories/*` |
| `src/shared/services/api/dealsApi.ts` | Typed HTTP wrappers for `/api/deals/*` |
| `src/shared/services/api/storesApi.ts` | Typed HTTP wrappers for `/api/stores/*` |
| `src/shared/services/api/universitiesApi.ts` | Typed HTTP wrappers for `/api/universities/*` |
| `src/shared/services/api/submitDealApi.ts` | Typed HTTP wrappers for `/api/submit-deal`, `/api/mark-as-read`, etc. |
| `src/shared/services/api/usersApi.ts` | Typed HTTP wrappers for `/api/users/*` |

---

## Changed files (summary)

### Types

- **`api/requests.ts`** — full set of backend request DTOs; `RedeemType` moved here (was in `entities/deal.ts`) to eliminate circular imports.
- **`api/responses.ts`** — full set of backend response DTOs; `DealResponse.redeemType` is now `RedeemType` (not `string`); `ResetPasswordResponse.message` is `string` (not `string | undefined`).
- **`entities/deal.ts`** — removed stale per-query response types (`GetDealsByCategoryResponse`, `GetDealsByStoreResponse`, `GetDealsByUniversityResponse`); all query endpoints now return the unified `DealResponse`.
- **`entities/*.ts`** — simplified to entity interface + canonical re-exports; no duplicate definitions.
- **`types/index.ts`** — removed direct `api/requests` and `api/responses` exports to prevent duplicate-export TS errors (DTOs surface through entity re-exports).

### API Client

- **`apiClient.ts`** — removed circular dep on `authService`; added `setRefreshTokenFn()` so the interceptor can call refresh without importing `authService`; added `buildFormData()` helper (used by universities).

### Services

| Service | Fixes |
|---------|-------|
| `authService.ts` | Added `changePassword()` (was missing); `refreshToken()` no longer sends `{}` body (contract: no body); `getUserProfile()` no longer accepts `usePublicClient` arg; added `clearUser()`; `deleteAccount()` returns `void` (was `{message}`); wires `setRefreshTokenFn`. |
| `categoryService.ts` | **BUG FIX** — create/update were using `multipart/form-data`; backend expects plain JSON `{ title: string }`. Fixed. |
| `dealService.ts` | **BUG FIX** — wrong default import `import apiClient, { publicApiClient }` (no default export exists). Fixed. `updateDeal` / `deleteDeal` return `void` (204). |
| `storeService.ts` | Same wrong default import bug fixed. `updateStore` returns `void` (204). |
| `universityService.ts` | Same wrong default import bug fixed. `updateUniversity` returns `void` (204). FormData construction delegated to `buildFormData`. |
| `submittedDealService.ts` | **BUG FIX** — `markAsRead` was typed as `→ {message}` but backend returns 204 (no body). `deleteSubmittedDeal` same fix. `getSubmittedDealById` added (was missing). |

### Contexts

- **`ErrorContext.tsx`** — `handleApiError` now uses `normalizeApiError`; 401/403/5xx always show safe frontend messages; field-error summaries shown for ValidationProblem responses.
- **`AuthContext.tsx`** — removed stale `getUserProfile(true)` argument; `register()` returns `void`; uses `authService.clearUser()`.

---

## Backend inconsistencies handled

| # | Endpoint | Inconsistency | Frontend handling |
|---|----------|---------------|-------------------|
| 1 | `GET /api/deals/search?query=` | Returns **204** when query is empty (not a real error) | `dealsApi.search()` returns `[]` for 204; empty query short-circuits before HTTP call |
| 2 | `POST /api/submit-deal` | Returns **202 Accepted** (not 200) with `{ message }` | axios accepts 2xx; response body handled normally |
| 3 | `GET /api/deals?cursor=` | May return plain array `[]` instead of `{ items, nextCursor, hasMore }` | `dealsApi.getAll()` normalises both shapes |
| 4 | `DELETE /api/users` (self) vs `DELETE /api/users/{id}` | Both on same base path, distinguished by presence of `/{id}` | Separate `usersApi.deleteSelf()` and `usersApi.deleteById(id)` |
| 5 | `POST /api/submit-deal` — request field `title`, response field `name` | Backend renames `title` → `name` in the response DTO | `SubmittedDeal.name` documents this; `SubmitDealRequest.title` used on send |
| 6 | `PUT /api/universities/{id}` — `isActive` must be string `"true"`/`"false"` | FormData does not support boolean natively | `buildFormData()` serialises booleans to `"true"`/`"false"` |
| 7 | `POST /api/auth/register` — errors come as `{ error }` OR `{ errors }` | Mixed shapes | `normalizeApiError` handles both via `data.error` and `data.errors` fields |
| 8 | `POST /api/auth/login` 403 — can mean "email not confirmed" OR "bad credentials" | Both are 403 but different semantics | `LoginPage.tsx` already differentiates via `detail` text; `ErrorContext` shows generic 403 message for all other contexts |

---

## Error normalizer shape

All API errors are normalised to:

```ts
interface NormalizedError {
  status?:      number;                      // HTTP status
  code?:        string;                      // backend errorCode / code field
  message:      string;                      // safe display message
  fieldErrors?: Record<string, string[]>;    // camelCase field → messages[]
}
```

**Decision table:**

| Error type | `message` source | Notes |
|------------|-----------------|-------|
| 5xx / no response | Generic frontend string | Never expose server detail |
| 401 (in `handleApiError`) | Generic "Please log in" | Security – don't echo backend |
| 403 (in `handleApiError`) | Generic "No permission" | Security – don't echo backend |
| ValidationProblem `errors` | Field messages joined | Field errors also available for form binding |
| ProblemDetails `detail` | Backend `detail` field | Shown verbatim |
| `{ error: string }` | Backend `error` field | Shown verbatim |
| `{ message: string }` | Backend `message` field | Shown verbatim |
| Plain string body | Body string | Shown verbatim |
| Unknown 4xx | Generic by status code | Fallback |

---

## Validation schemas (Zod)

All schemas in `src/shared/utils/validationSchemas.ts` mirror backend validators.

Key rules:
- Password: min 8, must match `/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/`
- Register username: max 10
- Deal URL / Store website: must be absolute `http(s)://` URL
- Deal `redeemType`: enum `Online | InStore | Both | Unknown`
- University name: max 250, country: max 100, code: max 10
- SubmitDeal promoCode: **required** (backend contract), max 100

---

## Usage examples

### Using normalizeApiError in a form page

```tsx
import { normalizeApiError } from '@/shared/utils/normalizeApiError';

try {
  await authService.login({ email, password });
} catch (err) {
  const { message, fieldErrors } = normalizeApiError(err);
  // bind field errors to inputs
  if (fieldErrors?.email) setEmailError(fieldErrors.email[0]);
  if (fieldErrors?.password) setPasswordError(fieldErrors.password[0]);
  // global message
  setFormError(message);
}
```

### Using a validation schema

```tsx
import { loginSchema } from '@/shared/utils/validationSchemas';

const result = loginSchema.safeParse({ email, password });
if (!result.success) {
  const flat = result.error.flatten().fieldErrors;
  // flat.email[0], flat.password[0] etc.
}
```

