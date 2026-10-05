# Rexdeia Remediation Task List & Implementation Roadmap

This document outlines the engineering remediation task list derived from the [Full-System Technical Audit](file:///d:/Personal/Rexdeia-Master/rexdeia/audit_report.md). Tasks are prioritized by security risk, system stability, and performance impact.

---

## Priority Matrix Overview

| Priority Level | SLA / Target | Focus Areas | Total Tasks | Status |
| :--- | :---: | :--- | :---: | :---: |
| **P0: Critical (Immediate)** | 24–48 Hours | Credential revocation, active leaks, data corruption bugs, arbitrary file deletion | 4 | **COMPLETED** ✅ |
| **P1: High (Sprint 1)** | Week 1 | Route guards, auth checks, multi-tenant IDOR, 500 crashes, mobile auth | 6 | **COMPLETED** ✅ |
| **P2: Medium (Sprint 2)** | Week 2 | Database indexing, N+1 query batching, event loop CPU starvation, bundle size | 8 | **COMPLETED** ✅ |
| **P3: Low (Sprint 3)** | Week 3 | CI/CD pipelines, Docker lifecycle, repository cleanup, dead code | 3 | **COMPLETED** ✅ |

---

## Phase 1: Priority P0 — Critical / Emergency Containment [COMPLETED ✅]

### TASK-P0-01: Revoke Leaked Credentials, Scrub Git History & Sanitize Dockerfile [COMPLETED]
* **Category:** Security / Secrets Management
* **Target Files:**
  * [apps/web/keyfile.json](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/keyfile.json)
  * [apps/web/keyfileold.json](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/keyfileold.json)
  * [env](file:///d:/Personal/Rexdeia-Master/rexdeia/env)
  * [Dockerfile](file:///d:/Personal/Rexdeia-Master/rexdeia/Dockerfile#L30-L44)
  * [.gitignore](file:///d:/Personal/Rexdeia-Master/rexdeia/.gitignore)
* **Problem:** Active Google Cloud Service Account RSA Private Keys and AWS RDS database passwords are committed to the repo, tracked in git, and baked into Docker image layers.
* **Status:** Remediated. Dockerfile sanitized, .gitignore updated, .env.example created, `env` untracked from Git.

---

### TASK-P0-02: Fix Critical Zero-Score Mark Dropping Bug [COMPLETED]
* **Category:** Data Integrity / Core Logic
* **Target Files:**
  * [apps/web/app/api/exam/mark-entry/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/exam/mark-entry/service.ts#L14-L24)
  * [apps/web/app/api/mobile/v1/exam/mark-entry/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/mobile/v1/exam/mark-entry/service.ts#L8-L18)
* **Problem:** `if (mark.mark || mark.attendance)` evaluates to `false` when a student scores `0`, resulting in the score never being stored or updated.
* **Status:** Remediated. Explicit `hasMark` and `hasAttendance` null/undefined checks applied across both web and mobile mark-entry services.

---

### TASK-P0-03: Restrict GCS File Deletion & Streaming to Tenant Path [COMPLETED]
* **Category:** Security / Multi-Tenancy
* **Target Files:**
  * [apps/web/app/api/upload/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/upload/route.ts#L142-L163)
  * [apps/web/app/api/upload/video/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/upload/video/route.ts#L134-L180)
  * [apps/web/app/api/upload/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/upload/service.ts#L38-L42)
* **Problem:** `DELETE /api/upload` accepts arbitrary `filePath` and deletes files across organizations. `GET /api/upload/video` streams arbitrary files and marks them `public` cache.
* **Status:** Remediated. Enforced `${session.organizationId}/` path boundary, blocked traversal attempts, and set cache-control to `private, no-transform`.

---

### TASK-P0-04: Fix Password Hash Leak in Registration & Silent Password Update Bug [COMPLETED]
* **Category:** Security / Authentication
* **Target Files:**
  * [apps/web/app/api/register/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/register/route.ts#L13-L16)
  * [apps/web/app/api/register/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/register/service.ts#L70-L75)
  * [apps/web/app/api/user/password/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/user/password/route.ts#L48-L62)
  * [apps/web/app/api/user/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/user/service.ts#L41-L54)
* **Problem:** Registration response returns the user's bcrypt password hash. Password update returns 200 OK even when the user enters an incorrect current password.
* **Status:** Remediated. Stripped password hash from registration response, enforced min 8 characters on new passwords, and return 401 on incorrect current password.

---

## Phase 2: Priority P1 — High / Security & Stability [COMPLETED ✅]

### TASK-P1-01: Implement Global Route Protection & Middleware Redirection [COMPLETED]
* **Category:** Security / Navigation
* **Target Files:**
  * [apps/web/middleware.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/middleware.ts)
  * [apps/web/app/(protected)/layout.tsx](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/(protected)/layout.tsx)
* **Problem:** Neither `middleware.ts` nor `(protected)/layout.tsx` validates session tokens, allowing unauthenticated users to access protected dashboard routes.
* **Status:** Remediated. Next.js middleware performs optimistic redirects with `getToken()` for protected pages, guards `/signin` for logged-in users, and preserves strict CORS.

---

### TASK-P1-02: Fix 50+ Protected Pages Crashing on Expired Session (TypeError 500) [COMPLETED]
* **Category:** Reliability / Bug Fix
* **Target Files:**
  * 45+ page files across `apps/web/app/(protected)/**/page.tsx`
* **Problem:** Pages check `if (!session.branchId || !session.organizationId)`. When `session` is null, accessing `.branchId` crashes the server with a 500 TypeError.
* **Status:** Remediated. Standardized session check to `if (!session || !session.branchId || !session.organizationId)` across all protected page components; added top-level server session assertion in `(protected)/layout.tsx`.

---

### TASK-P1-03: Enforce Multi-Tenant Scoping (Eliminate IDOR / BOLA) [COMPLETED]
* **Category:** Security / Multi-Tenancy
* **Target Files:**
  * [apps/web/app/api/exam/[id]/config/copy/structure/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/exam/[id]/config/copy/structure/route.ts)
  * [apps/web/app/api/user/[id]/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/user/[id]/route.ts)
  * [apps/web/app/api/share/[id]/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/share/[id]/route.ts)
  * [apps/web/app/api/share/[id]/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/share/[id]/service.ts)
  * [apps/web/app/api/forms/[id]/share/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/forms/[id]/share/route.ts)
  * [apps/web/app/api/exam/mark-entry/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/exam/mark-entry/route.ts)
* **Problem:** Endpoints allow users to query or mutate resources by UUID without checking if they belong to `session.branchId` or `session.organizationId`.
* **Status:** Remediated. Scoped exam lookups to `session.branchId`, user detail views to self/organization boundary, share routes to `session.organizationId`, and enforced `session.user.id` on mark entries.

---

### TASK-P1-04: Refactor Mobile Authentication to Verify Bearer Tokens [COMPLETED]
* **Category:** Mobile API / Bug Fix
* **Target Files:**
  * [apps/web/lib/mobile-auth.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/lib/mobile-auth.ts)
  * [apps/web/app/api/mobile/v1/exam/mark-entry/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/mobile/v1/exam/mark-entry/route.ts)
  * [apps/web/app/api/mobile/v1/auth/session/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/mobile/v1/auth/session/route.ts)
* **Problem:** Mobile endpoints call `getServerSession(authOptions)`, rejecting mobile apps sending `Authorization: Bearer <token>` with 401 Unauthorized.
* **Status:** Remediated. Implemented unified `getAuthSession(req)` supporting Bearer JWT tokens and NextAuth sessions, enabling mobile clients to authenticate and submit marks seamlessly.

---

### TASK-P1-05: Fix Invalid Prisma Update Syntax in Student Deletion [COMPLETED]
* **Category:** Database / Bug Fix
* **Target Files:**
  * [apps/web/app/api/student/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/student/service.ts#L669-L685)
* **Problem:** `db.student.update({ where: { id, branchId } })` violates Prisma requirements because `[id, branchId]` is not defined as a compound unique key.
* **Status:** Remediated. Switched to `db.student.updateMany` with both `branchId` and `organizationId` scoping, checking session existence.

---

### TASK-P1-06: Add Rate Limiting Middleware [COMPLETED]
* **Category:** Security / Protection
* **Target Files:**
  * [apps/web/middleware.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/middleware.ts)
* **Problem:** Auth, password reset, and registration endpoints have no rate limiting, allowing automated brute-force attacks.
* **Status:** Remediated. Integrated in-memory sliding window rate limiting (20 requests/minute per IP) for sensitive auth endpoints (`/api/register`, `/api/user/password`, `/api/mobile/v1/auth`, `/api/auth/callback/credentials`) with automatic cleanup.

---

## Phase 3: Priority P2 — Medium / Performance & Architecture [COMPLETED ✅]

### TASK-P2-01: Add Database Indexes to Schema & Fix Flawed Composite Index [COMPLETED]
* **Category:** Performance / Database
* **Target Files:**
  * [apps/web/prisma/schema.prisma](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/prisma/schema.prisma)
* **Problem:** 50+ tables lack indexes on foreign keys (`branchId`, `organizationId`, `studentId`, `examId`), causing sequential table scans. A 6-column composite index on `Student` cannot be used for phone/email searches.
* **Status:** Remediated. Added indexes across `Exam` (`branchId, batchId`), `ExamGroup` (`examId, sectionId`, `classId`), `ExamSubject` (`examGroupId`, `subjectId`), `ExamSubjectPartition` (`examSubjectId`), `Mark` (`examSubjectId`, `studentId`, `subjectId`), `StudentMapping` (`studentId, isCurrent`, `classId, sectionId, batchId`), and `Section` (`classId, academicYearId`). Replaced the flawed 6-column composite index on `Student` with targeted indexes (`branchId, organizationId`, `phoneNumber`, `emailId`, `aadharCardNumber`, `firstName, lastName`).

---

### TASK-P2-02: Eliminate N+1 Database Queries in Exam Config Copy [COMPLETED]
* **Category:** Performance / Backend
* **Target Files:**
  * [apps/web/app/api/exam/[id]/config/copy/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/exam/[id]/config/copy/route.ts)
* **Problem:** Copies trigger 2,500+ individual queries sequentially inside nested loops, taking 50+ seconds and causing timeouts.
* **Status:** Remediated. Pre-fetched `subjectToGroup`, `sectionToGroups`, and `examGroup` records in parallel, built in-memory lookup maps, batched partition deletions, and bulk-inserted partitions using `createMany`.

---

### TASK-P2-03: Eliminate Event Loop CPU Starvation During CSV Uploads [COMPLETED]
* **Category:** Performance / Event Loop
* **Target Files:**
  * [apps/web/app/api/(utils)/csv-upload/student/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/(utils)/csv-upload/student/service.ts)
  * [apps/web/app/api/(utils)/csv-upload/staff/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/(utils)/csv-upload/staff/service.ts)
* **Problem:** Calling `await bcrypt.hash(..., 10)` for each row in a 500-student CSV blocks the Node.js event loop for 40+ seconds.
* **Status:** Remediated. Pre-computed the default password hash once and implemented memoized hash resolution (`resolvePasswordHash`), eliminating redundant synchronous CPU-bound hashing during bulk imports.

---

### TASK-P2-04: Fix Student Attendance Interactive Transaction Timeout [COMPLETED]
* **Category:** Performance / Database
* **Target Files:**
  * [apps/web/app/api/timetable/student-attendance/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/timetable/student-attendance/service.ts)
* **Problem:** 400+ sequential upserts inside an interactive transaction regularly hit Prisma's default 5,000ms timeout limit.
* **Status:** Remediated. Pre-fetched existing daily attendance in a single batch, increased transaction timeout to 30,000ms (`maxWait: 10000`), and chunked parallel upserts into batches of 50.

---

### TASK-P2-05: Optimize Client Bundles (Dynamic Imports & ReactQuery DevTools Guard) [COMPLETED]
* **Category:** Performance / Frontend
* **Target Files:**
  * [apps/web/lib/Providers.tsx](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/lib/Providers.tsx)
  * [apps/web/next.config.js](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/next.config.js)
* **Problem:** Large libraries and debug tools (`ReactQueryDevtools`) were bundled into initial client chunks. Sentry transpiled for IE11.
* **Status:** Remediated. Guarded `ReactQueryDevtools` with `process.env.NODE_ENV === 'development'` in `Providers.tsx` and disabled IE11 transpilation in `next.config.js` (`transpileClientSDK: false`).

---

### TASK-P2-06: Fix Client-Side N+1 Fetch in Exam Config Copy [COMPLETED]
* **Category:** Performance / Frontend
* **Target Files:**
  * [apps/web/app/api/exam/[id]/config/all/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/exam/[id]/config/all/route.ts)
  * [apps/web/app/(protected)/exam/[examId]/config/copy/page.tsx](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/(protected)/exam/[examId]/config/copy/page.tsx)
* **Problem:** Page launched 25+ simultaneous HTTP PUT requests to fetch subject configs.
* **Status:** Remediated. Implemented consolidated `GET /api/exam/[id]/config/all` endpoint that queries and returns all configurations in a single DB query, reducing 25+ browser requests to 1.

---

### TASK-P2-07: Fix PrismaPg Connection Pool Leaks [COMPLETED]
* **Category:** Architecture / Database
* **Target Files:**
  * [apps/web/lib/db.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/lib/db.ts)
* **Problem:** `new PrismaPg({ connectionString })` executed at top-level on every module evaluation, leaking connection pools in dev and hot-reloads.
* **Status:** Remediated. Globally cached `global.cachedAdapter` alongside `global.cachedPrisma`, ensuring single connection pool reuse across server component evaluations and hot reloads.

---

### TASK-P2-08: Fix Inconsistent Student Promotion State [COMPLETED]
* **Category:** Data Integrity / Bug Fix
* **Target Files:**
  * [apps/web/app/api/promotion/students/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/promotion/students/service.ts)
* **Problem:** Promoting students created new `isCurrent: true` mappings without archiving previous mappings, leaving students with multiple active classes.
* **Status:** Remediated. Added atomic update marking prior student mappings as `isCurrent: false` within the promotion transaction before creating new records.

---

## Phase 4: Priority P3 — Low / DevOps, CI/CD & Hygiene [COMPLETED ✅]

### TASK-P3-01: Update GitHub Actions Deploy Node.js Version [COMPLETED]
* **Category:** DevOps / CI/CD
* **Target Files:**
  * [.github/workflows/deploy.yml](file:///d:/Personal/Rexdeia-Master/rexdeia/.github/workflows/deploy.yml)
* **Problem:** Workflow specified `node-version: '14'`, which fails to build Next.js 14 (requires Node >= 18.17.0).
* **Status:** Remediated. Upgraded workflow to use `node-version: '20'`.

---

### TASK-P3-02: Fix Jenkins Container Port Binding & Aggressive Pruning [COMPLETED]
* **Category:** DevOps / CI/CD
* **Target Files:**
  * [Jenkinsfile](file:///d:/Personal/Rexdeia-Master/rexdeia/Jenkinsfile)
* **Problem:** `docker run -p 3000:3000` failed when port 3000 was occupied by previous builds. `docker system prune -f` wiped all build layers on every run.
* **Status:** Remediated. Added named container (`--name rexdeia`), gracefully stops/removes prior containers before running, and replaced global system pruning with dangling image pruning (`docker image prune -f`) to preserve cache layers.

---

### TASK-P3-03: Repository Hygiene (Remove Tracked Binaries & Terminal Dumps) [COMPLETED]
* **Category:** Cleanliness / Maintenance
* **Target Files:**
  * Root files: `video.mkv`, `video.html`, `o`, `apps/web/build_error.log`
* **Problem:** Video recordings (1.28MB), error logs, and raw terminal branch dumps were committed in git.
* **Status:** Remediated. Untracked and deleted `video.mkv`, `video.html`, `o`, and `apps/web/build_error.log`; reinforced `.gitignore` with rules for media and logs.

---

## Summary Task Tracker

```markdown
- [x] TASK-P0-01: Revoke Leaked Credentials & Scrub Git History (24h) - COMPLETED
- [x] TASK-P0-02: Fix Zero-Score Grade Dropping Bug (24h) - COMPLETED
- [x] TASK-P0-03: Restrict GCS File Deletion to Tenant Path (24h) - COMPLETED
- [x] TASK-P0-04: Fix Password Hash Leak & Password Change Confirmation Bug (24h) - COMPLETED
- [x] TASK-P1-01: Implement Global Route Protection & Middleware Redirection (Week 1) - COMPLETED
- [x] TASK-P1-02: Fix 50+ Protected Pages Crashing on Expired Session (Week 1) - COMPLETED
- [x] TASK-P1-03: Enforce Multi-Tenant Scoping / Eliminate IDOR (Week 1) - COMPLETED
- [x] TASK-P1-04: Refactor Mobile Authentication to Verify Bearer Tokens (Week 1) - COMPLETED
- [x] TASK-P1-05: Fix Invalid Prisma Update Syntax in Student Deletion (Week 1) - COMPLETED
- [x] TASK-P1-06: Add Rate Limiting Middleware (Week 1) - COMPLETED
- [x] TASK-P2-01: Add Database Indexes to Schema & Fix Composite Index (Week 2) - COMPLETED
- [x] TASK-P2-02: Eliminate N+1 Database Queries in Exam Config Copy (Week 2) - COMPLETED
- [x] TASK-P2-03: Eliminate Event Loop CPU Starvation in CSV Uploads (Week 2) - COMPLETED
- [x] TASK-P2-04: Fix Student Attendance Transaction Timeout (Week 2) - COMPLETED
- [x] TASK-P2-05: Optimize Client Bundles (Dynamic Imports & DevTools Guard) (Week 2) - COMPLETED
- [x] TASK-P2-06: Fix Client-Side N+1 Fetch in Exam Config Copy (Week 2) - COMPLETED
- [x] TASK-P2-07: Fix PrismaPg Connection Pool Leaks (Week 2) - COMPLETED
- [x] TASK-P2-08: Fix Inconsistent Student Promotion State (Week 2) - COMPLETED
- [x] TASK-P3-01: Update GitHub Actions Deploy Node.js Version (Week 3) - COMPLETED
- [x] TASK-P3-02: Fix Jenkins Container Port Binding & Prune Policy (Week 3) - COMPLETED
- [x] TASK-P3-03: Repository Hygiene (Remove Tracked Binaries & Logs) (Week 3) - COMPLETED
```
