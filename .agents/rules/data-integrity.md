# Data Integrity & Live Data Rules

### 1. No Static / Mock Fallback Data in UI Components
- **Zero Mock Fallbacks**: Never hardcode static fallback arrays or mock items (e.g. sample classes, demo student counts, placeholder cards) inside components or state hooks.
- **Empty & Loading States**:
  - When data is fetching: Display an `ActivityIndicator` or skeleton loader.
  - When the API returns an empty array or encounters an error: Display an explicit empty state indicating **"No Data Available"** (or actionable error / retry prompt).
  - Never allow stale or demo data to mask API failures or empty responses.

### 2. User-Scoped Local Caching & State Reset
- **User-Specific Cache Keys**: Any offline or persistent client storage (such as `AsyncStorage` or `localStorage`) caching user-specific domain data must incorporate the active user's ID in the key (e.g. `@rexdeia_classes_${user.id}`).
- **Immediate State Invalidation**:
  - When switching users, logging in, or logging out, immediately reset component state (e.g. `setClasses([])`) to prevent previous accounts' data from leaking or briefly flashing on screen.
  - In React hooks (`useEffect`), always include `user?.id` in dependency arrays when fetching or loading user-scoped data.

### 3. Prisma Schema Relation Casing Verification
- Before writing Prisma queries with relations, always verify the exact relation field name in `schema.prisma`.
- Note Prisma model casing conventions in this repository:
  - Relation on `Batch` to `AcademicSubjectForStaff` is **PascalCase** (`AcademicSubjectForStaff`).
  - Relation on `Section` to `AcademicSubjectForStaff` is **camelCase** (`academicSubjectForStaff`).
- Never assume relation casing without checking `schema.prisma` first, as Prisma relation mismatches cause unhandled 500 runtime errors.
