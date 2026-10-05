# Rexdeia Full-System Technical Audit & Vulnerability Assessment

**Date of Assessment:** September 2026  
**Target Repository:** `RexKnar/rexdeia` (`apps/web`, `packages/*`)  
**Scope:** Architecture, Security Posture, Database Performance, API Robustness, Client Optimization, and DevOps Pipeline  

---

## Executive Summary

A comprehensive architectural and source code analysis of the **Rexdeia** platform was conducted across all applications and shared packages. The platform is a multi-tenant academic and examination management system built on **Next.js 14 (App Router)**, **Prisma ORM**, **PostgreSQL**, **Google Cloud Storage (GCS)**, and **Razorpay**.

While the project has an extensive feature set covering academic years, timetables, examinations, learners, and staff management, the codebase contains **critical security vulnerabilities**, **severe database and query bottlenecks**, **high-risk architectural oversights**, and **broken CI/CD pipelines** that must be addressed before production operations or scale.

### Severity Breakdown
| Severity | Count | Primary Impact Areas |
| :--- | :---: | :--- |
| **Critical** | 8 | Active credential leaks, IDOR data theft/deletion, arbitrary bucket tampering, unauthenticated APIs, student grade manipulation |
| **High** | 7 | Event loop CPU starvation (DoS), database missing 90%+ indexes, N+1 query storms, silent password updates, unhandled 500 crashes |
| **Medium** | 6 | Bloated bundles (XLSX, jsPDF, DevTools), broken mobile authentication, connection pool leaks, Docker container collisions |
| **Low / Quality** | 5 | Stray media files, git tracking junk, Node 14 CI mismatch, dead `withAuth` wrappers |

---

## 1. Critical Security Vulnerabilities

### 1.1. Active Leaked Credentials & Private Keys in Git and Dockerfile
* **Severity:** Critical
* **Files:**
  * [apps/web/keyfile.json](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/keyfile.json#L1-L14)
  * [apps/web/keyfileold.json](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/keyfileold.json)
  * [env](file:///d:/Personal/Rexdeia-Master/rexdeia/env#L1-L22)
  * [Dockerfile](file:///d:/Personal/Rexdeia-Master/rexdeia/Dockerfile#L30-L44)
* **Vulnerability Mechanics:**
  1. `apps/web/keyfile.json` and `keyfileold.json` contain active **Google Cloud Service Account RSA Private Keys** for `rexdeia@sixth-oxygen-445513-g7.iam.gserviceaccount.com`.
  2. The root `env` file is actively tracked by git (`git ls-files env`), exposing live AWS RDS PostgreSQL endpoints, passwords, Razorpay API test secrets, and NextAuth session secrets.
  3. `Dockerfile` hardcodes production database connection strings with passwords (`postgres:rexCoders123@...rds.amazonaws.com`) and secrets directly in `ENV` statements:
     ```dockerfile
     ENV DATABASE_URL=postgresql://postgres:rexCoders123@rexdeia.crug228k820z.us-east-2.rds.amazonaws.com:5432/rexdeia
     ENV NEXTAUTH_SECRET=2b7e151628aed2a6abf7158809cf4f3c762e7160f38b4da56a784d9045190cba
     ENV NEXT_RAZORPAY_KEY_SECRET=xt6nQmfxv4bjKZdC0xEU14ei
     ```
  4. In `Dockerfile`, `RUN rm -f .env` (Line 28) executes *after* `COPY . .`. In Docker's layered filesystem, deleting a file in a downstream layer does not purge it from earlier layers; any user who pulls the Docker image can inspect and extract `.env`.
* **Impact:** Full compromise of Google Cloud Storage buckets, complete takeover of AWS RDS databases, potential financial abuse of payment gateways, and session forging.
* **Remediation:**
  1. Immediately revoke the GCP service account keys in Google Cloud Console.
  2. Rotate database passwords on AWS RDS and Razorpay API secrets.
  3. Remove `env` and `keyfile*.json` from git history using `git-filter-repo` or BFG Repo-Cleaner.
  4. Inject secrets into Docker containers exclusively at runtime via orchestration secrets (Kubernetes Secrets, Docker Swarm secrets, or AWS ECS task definitions / parameter store).

---

### 1.2. Absence of Global Route Protection & Middleware Authorization
* **Severity:** Critical
* **Files:**
  * [apps/web/middleware.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/middleware.ts#L32-L58)
  * [apps/web/app/(protected)/layout.tsx](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/(protected)/layout.tsx#L15-L41)
  * [apps/web/lib/utils/api-auth.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/lib/utils/api-auth.ts#L17-L31)
* **Vulnerability Mechanics:**
  1. `middleware.ts` only sets CORS headers. It contains zero session verification, role validation, or route gating.
  2. The `(protected)` route group layout (`apps/web/app/(protected)/layout.tsx`) does not check `getServerSession(authOptions)` and performs no redirection.
  3. Out of **185 API routes** in `apps/web/app/api`, only **7** call the centralized `requireSession()` guard. While some routes make ad-hoc `getServerSession()` calls, dozens of API handlers fail to verify user identity or role permissions.
* **Impact:** Anyone can access the dashboard layouts and trigger unauthenticated or unauthorized endpoints.

---

### 1.3. Multi-Tenant Broken Object-Level Authorization (IDOR / BOLA)
* **Severity:** Critical
* **Files:**
  * [apps/web/app/api/exam/[id]/config/copy/structure/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/exam/[id]/config/copy/structure/route.ts#L19-L28)
  * [apps/web/app/api/user/[id]/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/user/[id]/route.ts#L45-L55)
  * [apps/web/app/api/student/[id]/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/student/[id]/route.ts#L49-L59)
  * [apps/web/app/api/share/[id]/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/share/[id]/service.ts#L29-L35)
* **Vulnerability Mechanics:**
  1. In `api/exam/[id]/config/copy/structure/route.ts`:
     ```typescript
     const exam = await db.exam.findUnique({
       where: { id },
       select: { batchId: true },
     });
     ```
     The query fetches the exam by `id` without scoping by `branchId: session.branchId` or `organizationId: session.organizationId`. A user from School A can read exam structures, classes, and sections from School B.
  2. In `api/user/[id]/route.ts`: Any authenticated user can supply any UUID to fetch the user's name, email, phone number, and all associated organization and branch records.
  3. In `api/share/[id]/service.ts`:
     ```typescript
     export async function getShareById(shareId: string) {
       return await db.share.findUnique({ where: { id: shareId } });
     }
     ```
     `updateShareById` allows updating discount amounts and payment requirements for any form share across tenants without verifying tenant ownership.
* **Impact:** Cross-tenant data leaks and unauthorized manipulation of academic resources, exams, and financial configurations.
* **Remediation:** Enforce strict multi-tenant criteria in every Prisma query (`where: { id, branchId: session.branchId, organizationId: session.organizationId }`).

---

### 1.4. Arbitrary File Deletion & Cross-Tenant Access in Google Cloud Storage
* **Severity:** Critical
* **Files:**
  * [apps/web/app/api/upload/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/upload/route.ts#L142-L163)
  * [apps/web/app/api/upload/video/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/upload/video/route.ts#L134-L180)
  * [apps/web/app/api/upload/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/upload/service.ts#L38-L42)
* **Vulnerability Mechanics:**
  1. In `api/upload/route.ts` and `api/upload/video/route.ts`:
     ```typescript
     export async function DELETE(request: NextRequest) {
       const filePath = request.nextUrl.searchParams.get('filePath');
       // ... session checked, but filePath is never validated ...
       const response = await deleteFileFromGCS(bucket, filePath);
     ```
     The endpoint accepts an arbitrary `filePath` query parameter and immediately invokes `bucket.file(filePath).delete()`.
  2. Any authenticated user can delete files belonging to other schools, student ID proofs, exam papers, or institutional assets by passing the target file path.
  3. In `api/upload/video/route.ts` (Lines 165-175), `GET` takes `?path=...` and streams any file in the GCS bucket to the caller, while tagging it with `Cache-Control: public, max-age=31536000`.
  4. `POST /api/upload` lacks MIME-type validation, file size limits, and filename sanitization.
* **Impact:** Complete data destruction in cloud storage; exfiltration of private documents and media.
* **Remediation:**
  1. Validate that any requested `filePath` starts with `${session.organizationId}/`.
  2. Reject directory traversal (`..`, leading slashes).
  3. Enforce strict upload limits (maximum file size, allowed extensions, and MIME sniffing).

---

### 1.5. Grade & Attendance Entry Logic Flaw: Falsy `0` Drops Student Marks
* **Severity:** Critical
* **Files:**
  * [apps/web/app/api/exam/mark-entry/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/exam/mark-entry/service.ts#L14-L35)
  * [apps/web/app/api/mobile/v1/exam/mark-entry/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/mobile/v1/exam/mark-entry/service.ts#L8-L18)
* **Vulnerability Mechanics:**
  In both web and mobile mark-entry services:
  ```typescript
  if (mark.mark || mark.attendance) {
    const data = {
      studentId: studentId,
      userId: markEntryPayload.userId,
      // ...
      mark: +mark.mark,
      attandance: +mark.attendance,
    };
  ```
  In JavaScript, `0` is falsy (`Boolean(0) === false`). If a student scores `0` marks and was marked absent (`0`) or attended with 0 marks, `mark.mark || mark.attendance` evaluates to `false`.
* **Impact:** Students who score 0 in an exam will never have their marks recorded or updated. The database retains previous marks or leaves the student record blank. Furthermore, `attandance` is misspelled across the Prisma schema and code.
* **Remediation:** Replace truthiness checks with null/undefined checks:
  ```typescript
  if (mark.mark !== undefined && mark.mark !== null && mark.mark !== '')
  ```

---

### 1.6. Credential Leakage in Registration & Silent Password Update Failure
* **Severity:** Critical
* **Files:**
  * [apps/web/app/api/register/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/register/route.ts#L13-L16)
  * [apps/web/app/api/register/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/register/service.ts#L70-L75)
  * [apps/web/app/api/user/password/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/user/password/route.ts#L48-L62)
  * [apps/web/app/api/user/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/user/service.ts#L41-L54)
* **Vulnerability Mechanics:**
  1. `POST /api/register` creates the user via `db.user.create()` and returns `{ ...createdUser, createdBranchId, createdOrganizationId }` directly to the client. Because `createdUser` contains the `password` column, **the bcrypt password hash is sent in plain HTTP response body** to the caller.
  2. In `api/user/service.ts`, `updateUserPassword` returns `{ error: 'in Valid current password' }` when `bcrypt.compare` fails—it **does not throw**.
  3. In `api/user/password/route.ts`:
     ```typescript
     await updateUserPassword(session.user.id, currentPassword, newPassword);
     return NextResponse.json(
       { message: 'Password changed successfully' },
       { status: 200 }
     );
     ```
     Because `updateUserPassword` does not throw, the route ignores the return value and responds with **200 OK: "Password changed successfully"** even when the user enters an invalid current password!
* **Impact:** Exposure of password hashes over the wire; false confirmation of password reset leaving compromised accounts unsecured.
* **Remediation:**
  1. Exclude the `password` field from user creation responses (`select: { id: true, email: true, ... }`).
  2. In `updateUserPassword`, throw an explicit error on invalid current password and verify the result before returning 200 OK.

---

### 1.7. Flawed Mobile Authentication & Unusable Mobile Endpoints
* **Severity:** High
* **Files:**
  * [apps/web/app/api/mobile/v1/auth/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/mobile/v1/auth/route.ts#L13-L24)
  * [apps/web/app/api/mobile/v1/exam/mark-entry/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/mobile/v1/exam/mark-entry/route.ts#L36-L41)
  * [apps/web/lib/mobile-auth.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/lib/mobile-auth.ts#L77-L108)
* **Vulnerability Mechanics:**
  1. `/api/mobile/v1/auth` issues Bearer JWT access tokens and refresh tokens for mobile clients.
  2. However, `/api/mobile/v1/exam/mark-entry/route.ts` calls `getServerSession(authOptions)`. Mobile applications sending `Authorization: Bearer <token>` do not send NextAuth cookies, causing this mobile API to reject all mobile client requests with `401 UNAUTHORIZED`.
  3. Refresh tokens are signed JWTs with `7d` expiration, but are never persisted or checked against a revocation store. If a device is stolen, the token cannot be invalidated.
* **Impact:** Mobile features are fundamentally non-functional; inability to revoke mobile sessions.

---

### 1.8. Missing Rate Limiting Across Critical Endpoints
* **Severity:** High
* **Locations:**
  * `/api/register`
  * `/api/user/password`
  * `/api/auth/callback/credentials`
  * `/api/upload`
* **Vulnerability Mechanics:**
  The application has zero rate limiting or throttling middleware (neither Redis/Upstash, token bucket, nor IP-based limiting).
* **Impact:** Susceptible to automated credential stuffing, brute-force password cracking, storage exhaustion, and denial of service.

---

## 2. Major Performance & Scalability Bottlenecks

### 2.1. Severe Database Index Deficiencies (11 Indexes across 50+ Models)
* **Severity:** High
* **Files:**
  * [apps/web/prisma/schema.prisma](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/prisma/schema.prisma#L738)
* **Bottleneck Analysis:**
  1. PostgreSQL **does not** automatically index foreign key columns. In the entire 1,679-line Prisma schema, there are only **11 `@@index` annotations**.
  2. Critical join and filter columns have **no indexes whatsoever**:
     * `Mark`: `examSubjectId`, `subjectId`, `userId`, `assessmentFormatId`
     * `Student`: `branchId`, `organizationId`, `batchId`
     * `Exam`: `branchId`, `batchId`, `termId`
     * `Section`: `academicYearId`, `classId`
     * `ExamGroup`: `examId`, `sectionId`, `classId`
  3. Every query filtering or joining on these columns forces PostgreSQL to execute a **sequential table scan (Seq Scan)** reading every row from disk.
  4. Deleting or updating a record in a parent table (e.g. `Exam` or `Student`) causes PostgreSQL to lock and sequentially scan the entire child table (`Mark`, `ExamGroup`) to verify referential integrity.
  5. **Ineffective Composite Index:** Line 738 defines:
     ```prisma
     @@index([firstName, lastName, emisNumber, phoneNumber, emailId, aadharCardNumber])
     ```
     In B-Tree indexing, this index is only usable if queries search by `firstName`. Searching by `phoneNumber`, `emailId`, or `aadharCardNumber` cannot use this index and executes a full table scan.
* **Remediation:** Add dedicated indexes on foreign keys and unique constraints in `schema.prisma`. Replace the 6-column composite index with individual indexes on `phoneNumber`, `emisNumber`, and `aadharCardNumber`.

---

### 2.2. N+1 Database Query Storms in Exam Copy & Bulk CSV Operations
* **Severity:** High
* **Files:**
  * [apps/web/app/api/exam/[id]/config/copy/route.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/exam/[id]/config/copy/route.ts#L86-L195)
  * [apps/web/app/api/(utils)/csv-upload/staff/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/(utils)/csv-upload/staff/service.ts#L11-L100)
  * [apps/web/app/api/timetable/student-attendance/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/timetable/student-attendance/service.ts#L216-L253)
* **Bottleneck Analysis:**
  1. In `api/exam/[id]/config/copy/route.ts`: A loop iterates over incoming `items`. For each item, it executes 5 to 7 individual database roundtrips (`findFirst`, `create`, `deleteMany`, and partition inserts). For 15 classes with 3 sections and 8 subjects, this triggers **over 2,500 individual queries**. Over remote cloud DB latency (20ms), the endpoint takes **50+ seconds**, triggering Next.js and reverse proxy timeouts.
  2. In `timetable/student-attendance/service.ts`: `saveStudentAttendance` executes 400+ sequential upsert operations inside a single Prisma interactive transaction (`db.$transaction(async (tx) => { ... })`). Prisma's default transaction timeout is **5,000ms**, causing bulk attendance submissions to fail frequently with transaction timeout exceptions.
* **Remediation:** Use `createMany()` with bulk data structures, or pre-fetch reference maps into memory and execute batch inserts in chunks.

---

### 2.3. Event Loop CPU Starvation During CSV Uploads (Bcrypt in Loops)
* **Severity:** High
* **Files:**
  * [apps/web/app/api/(utils)/csv-upload/student/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/(utils)/csv-upload/student/service.ts#L116-L125)
  * [apps/web/app/api/(utils)/csv-upload/staff/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/(utils)/csv-upload/staff/service.ts#L22-L25)
* **Bottleneck Analysis:**
  1. In `addStudentCSV` and `addStaffCSV`, `await bcrypt.hash(..., 10)` is invoked inside a loop for each row.
  2. Bcrypt with cost factor 10 takes 70–100ms of intensive CPU computation per hash.
  3. For a CSV with 500 students or 100 staff, hashing sequentially consumes **35–50 seconds of continuous 100% CPU thread time**.
  4. Because Node.js utilizes a single-threaded event loop, **all other web requests from all institutions are blocked and stall** until the CSV hashing completes.
* **Remediation:**
  1. Pre-generate a single shared default hash once per batch (e.g. for `Password@123`), and assign that hash to all new student user accounts.
  2. Offload bulk user provisioning to a background worker (BullMQ, Celery, or AWS SQS).

---

### 2.4. Client Bundle Bloat & Production Packaging Overhead
* **Severity:** Medium
* **Files:**
  * [apps/web/lib/Providers.tsx](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/lib/Providers.tsx#L4-L31)
  * [apps/web/next.config.js](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/next.config.js#L54-L57)
  * [apps/web/package.json](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/package.json#L68)
* **Bottleneck Analysis:**
  1. `ReactQueryDevtools` is imported and mounted directly in `Providers.tsx` without an environment guard, shipping debugging UI code to production users.
  2. `xlsx` (~1.2MB), `jspdf`, and `jspdf-autotable` are statically imported into client components (`rosterExport.ts`, `attendanceReportExport.ts`), forcing end users on mobile or slow connections to download massive bundles upfront.
  3. In `next.config.js`:
     * `transpileClientSDK: true` transpiles Sentry for IE11 compatibility, increasing client bundle size.
     * `tunnelRoute: '/monitoring'` proxies all analytics traffic through the Next.js server, doubling server request volume.
* **Remediation:**
  1. Wrap `ReactQueryDevtools` in `process.env.NODE_ENV === 'development'`.
  2. Use dynamic imports (`await import('xlsx')`) inside click handlers when exports are initiated.
  3. Disable IE11 SDK transpilation in `next.config.js`.

---

### 2.5. Client-Side N+1 Fetch Cascades & Quadratic Table Renders
* **Severity:** Medium
* **Files:**
  * [apps/web/app/(protected)/exam/[examId]/config/copy/page.tsx](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/(protected)/exam/[examId]/config/copy/page.tsx#L157-L167)
* **Bottleneck Analysis:**
  1. When selecting a source exam to copy, the client fetches subjects and then executes `Promise.all` with individual `fetch(...)` calls for **every single subject** using HTTP `PUT`:
     ```typescript
     uniqueSubjects.map(async (subj: any) => {
       const res = await fetch(`/api/exam/${sourceExamId}/config/subject/${subj.id}`, {
         method: 'PUT',
         body: JSON.stringify({ sectionIds: [] }),
       });
     ```
     For an exam with 25 subjects, the browser fires 25 parallel HTTP requests with CORS preflight handshakes.
  2. Inside the table rendering loop (Lines 444–460), `sourceConfigs.filter()` and `arr.findIndex()` run on every single row on every render pass, creating an $O(N \cdot M^2)$ computational overhead.
* **Remediation:** Consolidate configuration retrieval into a single `GET /api/exam/[id]/config` endpoint that returns the complete matrix in one payload. Pre-compute lookup maps in a `useMemo` hook.

---

### 2.6. Potential Database Connection Pool Leaks in Prisma Adapter
* **Severity:** Medium
* **Files:**
  * [apps/web/lib/db.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/lib/db.ts#L10-L19)
* **Bottleneck Analysis:**
  ```typescript
  const connectionString = `${process.env.DATABASE_URL}`
  let prisma: PrismaClient;
  const adapter = new PrismaPg({ connectionString })
  if (process.env['NODE_ENV'] === 'production') {
    prisma = new PrismaClient({ adapter });
  } else {
    if (!global.cachedPrisma) {
      global.cachedPrisma = new PrismaClient({ adapter });
    }
    prisma = global.cachedPrisma;
  }
  ```
  `const adapter = new PrismaPg({ connectionString })` is invoked at top-level on every module re-evaluation. While `global.cachedPrisma` caches the Prisma instance in development, each evaluation creates an orphaned `PrismaPg` connection pool instance that remains open, exhausting PostgreSQL max connections.
* **Remediation:** Cache the adapter instance on `global` alongside `cachedPrisma`.

---

## 3. Code Quality, Logic Bugs & Architectural Flaws

### 3.1. Unhandled 500 Crashes on Expired Session (50+ Protected Pages)
* **Severity:** High
* **Files:** 50+ pages in `apps/web/app/(protected)/*`
  * Example: [apps/web/app/(protected)/exams/page.tsx](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/(protected)/exams/page.tsx#L10-L13)
* **Bug Mechanics:**
  ```typescript
  export default async function Page() {
    const session = await getServerSession(authOptions);
    if (!session.branchId || !session.organizationId) {
      return redirect('/signin?callbackUrl=/academics/batches');
    }
  ```
  If a user's session expires or they visit a link unauthenticated, `session` is `null`. Accessing `session.branchId` throws:
  `TypeError: Cannot read properties of null (reading 'branchId')`
  Instead of redirecting the user to `/signin`, Next.js throws an unhandled server exception resulting in a 500 error page.
* **Remediation:** Guard session existence first: `if (!session || !session.branchId || !session.organizationId)`.

---

### 3.2. RBAC Type Mismatch: `organizationRole` Array vs. Object
* **Severity:** Medium
* **Files:**
  * [apps/web/types/auth.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/types/auth.ts#L29)
  * [apps/web/lib/auth.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/lib/auth.ts#L63)
  * [apps/web/lib/auth/permission.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/lib/auth/permission.ts#L14-L16)
* **Bug Mechanics:**
  In `types/auth.ts`, `User.organizationRole` is typed as a single `OrganizationRole` object. In `lib/auth.ts`, it is assigned as `any[]` (array). In `lib/auth/permission.ts`:
  ```typescript
  const moduleAccess = this.session.user?.organizationRole?.moduleAccess.find(...)
  ```
  Accessing `.moduleAccess` on an array returns `undefined`, and calling `.find(...)` crashes with a runtime `TypeError`.

---

### 3.3. Invalid Prisma Update Syntax in Student Deletion
* **Severity:** Medium
* **Files:**
  * [apps/web/app/api/student/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/student/service.ts#L671-L678)
* **Bug Mechanics:**
  ```typescript
  export async function deleteStudentById(id: string) {
    const session = await getServerSession(authOptions);
    return db.student.update({
      where: {
        id: id,
        branchId: session.branchId, // Invalid in Prisma update
      },
      data: { isDeleted: true, updatedAt: new Date() },
    });
  }
  ```
  Prisma's `model.update({ where: ... })` requires a unique selector (`@id` or `@@unique`). The `Student` model does not have `@@unique([id, branchId])`. Passing non-unique fields into `update` is a Prisma type error and runtime exception.
* **Remediation:** Use `db.student.updateMany({ where: { id, branchId: session.branchId }, data: { isDeleted: true } })`.

---

### 3.4. Browser `window` Reference in Shared Client `makeAPICall`
* **Severity:** Low
* **Files:**
  * [apps/web/lib/api.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/lib/api.ts#L16)
* **Bug Mechanics:**
  `makeAPICall` uses `new URL(`${window.location.origin}${endpoint}`)`. If this function is ever called in Server Components or SSR, Node.js throws `ReferenceError: window is not defined`. Furthermore, it fails to set `'Content-Type': 'application/json'` on POST/PUT requests.

---

### 3.5. Broken Student Promotion Leaving Inconsistent State
* **Severity:** Medium
* **Files:**
  * [apps/web/app/api/promotion/students/service.ts](file:///d:/Personal/Rexdeia-Master/rexdeia/apps/web/app/api/promotion/students/service.ts#L49-L67)
* **Bug Mechanics:**
  When promoting students, `promoteStudentToNewClass` creates new `StudentMapping` rows with `isCurrent: true`, but never archives or sets `isCurrent: false` on the previous year's mappings. Students end up with multiple "current" classes, corrupting student rosters and attendance tracking.

---

## 4. DevOps, CI/CD & Deployment Deficiencies

### 4.1. Node.js Version Incompatibility in Deploy Workflow
* **Severity:** High
* **Files:**
  * [.github/workflows/deploy.yml](file:///d:/Personal/Rexdeia-Master/rexdeia/.github/workflows/deploy.yml#L17)
* **Deficiency:**
  `deploy.yml` sets:
  ```yaml
  - name: Install Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '14'
  ```
  Next.js 14 requires **Node.js >= 18.17.0**. Attempting to build Next.js 14 on Node 14 fails immediately with syntax and engine errors.

---

### 4.2. Broken Docker Run Port Binding in Jenkins Pipeline
* **Severity:** Medium
* **Files:**
  * [Jenkinsfile](file:///d:/Personal/Rexdeia-Master/rexdeia/Jenkinsfile#L40-L46)
* **Deficiency:**
  The `Deploy Application` stage runs:
  ```bash
  docker run -d -p 3000:3000 --restart unless-stopped rexdeia:latest
  ```
  It does not stop or remove the existing container running on port 3000. Re-deploying causes Docker to fail with `bind: address already in use`. Furthermore, running `docker system prune -f` in the `always` post-step deletes all cached layers, making every subsequent build take 15+ minutes.

---

### 4.3. Tracked Binary Media & Terminal Dumps in Git Root
* **Severity:** Low
* **Files:**
  * `video.mkv` (1.27 MB video recording in root)
  * `video.html` (16.6 KB HTML player in root)
  * `o` (Raw terminal ANSI escape dump of git branch output)
  * `apps/web/build_error.log` (23 KB error log)
* **Deficiency:**
  Accidental local files and video artifacts were committed to the root directory, cluttering the workspace and bloating clone times.

---

## Prioritized Remediation Roadmap

```mermaid
graph TD
    A[Phase 1: Emergency Containment] --> B[Phase 2: Authorization & Core Fixes]
    B --> C[Phase 3: Database & Performance]
    C --> D[Phase 4: CI/CD & Hygiene]

    subgraph "Phase 1: Immediate (24-48 Hours)"
        A1[Revoke GCP Key & RDS Passwords]
        A2[Scrub env & keyfile from Git]
        A3[Fix Mark Entry 0-score Bug]
    end

    subgraph "Phase 2: Critical Fixes (Week 1)"
        B1[Implement Global Middleware Auth Guard]
        B2[Enforce Tenant Scoping on All API Routes]
        B3[Fix GCS Path Isolation & Delete Restrictions]
        B4[Fix Password Update Status Bug]
    end

    subgraph "Phase 3: Performance (Week 2)"
        C1[Add 40+ Foreign Key Indexes to Schema]
        C2[Refactor Exam Copy & CSV N+1 Queries]
        C3[Dynamic Import XLSX/jsPDF & DevTools Guard]
    end

    subgraph "Phase 4: Pipeline & Cleanup (Week 3)"
        D1[Upgrade GitHub Action to Node 20]
        D2[Fix Docker Container Port Handling]
        D3[Clean Root Artifacts and .gitignore]
    end
```

### Action Items Checklist

#### Phase 1: Immediate Containment (24–48 Hours)
- [ ] In Google Cloud Console, delete and rotate the leaked Service Account key (`sixth-oxygen-445513-g7`).
- [ ] Change the AWS RDS master password and update deployment environment variables.
- [ ] Purge `keyfile.json`, `keyfileold.json`, and `env` from git history.
- [ ] Fix the `0` falsy bug in `apps/web/app/api/exam/mark-entry/service.ts`.

#### Phase 2: Authorization & Route Integrity (Week 1)
- [ ] Add route protection to `middleware.ts` redirecting unauthenticated users to `/signin`.
- [ ] Update `apps/web/app/(protected)/layout.tsx` to verify `getServerSession(authOptions)`.
- [ ] Secure `apps/web/app/api/upload/route.ts` and `video/route.ts`: enforce that `filePath` is strictly scoped within `session.organizationId`.
- [ ] Fix `updateUserPassword` in `apps/web/app/api/user/service.ts` to throw on invalid password and handle return codes in route handler.
- [ ] Fix null pointer checks in all 50+ protected page components (`if (!session || !session.branchId)`).

#### Phase 3: Database & Performance (Week 2)
- [ ] Add missing indexes across `schema.prisma` (`branchId`, `organizationId`, `studentId`, `examId`, `sectionId`, `batchId`).
- [ ] Replace 6-column composite index on `Student` with individual indexes on `phoneNumber`, `emisNumber`, and `aadharCardNumber`.
- [ ] Optimize `api/exam/[id]/config/copy/route.ts` by using bulk queries instead of loop-based `findFirst`/`create`.
- [ ] Dynamically import `xlsx` and `jspdf` on the client side.
- [ ] Guard `ReactQueryDevtools` with `process.env.NODE_ENV === 'development'`.

#### Phase 4: DevOps & Housekeeping (Week 3)
- [ ] Update `.github/workflows/deploy.yml` to use `node-version: '20'`.
- [ ] Update `Jenkinsfile` to stop and remove previous containers before running new instances.
- [ ] Remove `video.mkv`, `video.html`, `o`, and `build_error.log` from the repository.
