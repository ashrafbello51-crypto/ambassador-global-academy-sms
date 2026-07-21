/**
 * Comprehensive E2E Test Script
 * Tests: Authentication (all roles), Student CRUD, RBAC, URL access control
 *
 * Usage:
 *   1. Start dev server:  npm run dev
 *   2. Run this script:   npx tsx scripts/e2e-test.ts
 */

const BASE = process.argv[2] || "http://localhost:3000";

interface TestResult {
  name: string;
  passed: boolean;
  detail?: string;
}

const results: TestResult[] = [];
let passedCount = 0;
let failedCount = 0;

function assert(name: string, condition: boolean, detail?: string) {
  const r: TestResult = { name, passed: condition, detail };
  results.push(r);
  if (condition) {
    passedCount++;
    process.stdout.write(`  ✓ ${name}\n`);
  } else {
    failedCount++;
    process.stdout.write(`  ✗ ${name}${detail ? ` — ${detail}` : ""}\n`);
  }
}

function parseSetCookie(cookie: string): string {
  return cookie.split(";")[0];
}

async function login(email: string, password: string): Promise<string | null> {
  try {
    // Step 1: Get CSRF token (and its cookie)
    const csrfRes = await fetch(`${BASE}/api/auth/csrf`, { cache: "no-store" });
    if (!csrfRes.ok) return null;
    const { csrfToken } = await csrfRes.json();
    const csrfCookies = (csrfRes.headers.getSetCookie?.() ?? [])
      .map(parseSetCookie).join("; ");

    // Step 2: POST credentials — forward CSRF cookie + token
    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("password", password);
    formData.append("csrfToken", csrfToken);
    formData.append("callbackUrl", "/dashboard");

    const loginRes = await fetch(`${BASE}/api/auth/callback/credentials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...(csrfCookies ? { Cookie: csrfCookies } : {}),
      },
      body: formData.toString(),
      redirect: "manual",
    });

    if (!loginRes.ok && loginRes.status !== 302) {
      return null;
    }

    // Step 3: Extract session cookie from response
    const cookies = loginRes.headers.getSetCookie?.() ?? [];
    const sessionCookie = cookies.find(
      (c) => c.includes("authjs.session-token=") || c.includes("__Secure-authjs.session-token=")
    );

    if (!sessionCookie) {
      // Try following redirect to see if we land on dashboard
      const location = loginRes.headers.get("location");
      if (location) {
        const followRes = await fetch(`${BASE}${location}`, {
          headers: { ...(csrfCookies ? { Cookie: csrfCookies } : {}) },
          redirect: "manual",
        });
        const followCookies = followRes.headers.getSetCookie?.() ?? [];
        const followSession = followCookies.find(
          (c) => c.includes("authjs.session-token=") || c.includes("__Secure-authjs.session-token=")
        );
        return followSession || null;
      }
      return null;
    }

    return parseSetCookie(sessionCookie);
  } catch (e) {
    return null;
  }
}

async function apiGet(path: string, cookie: string): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    headers: { ...(cookie ? { cookie } : {}) },
    redirect: "manual",
  });
}

async function apiPost(path: string, body: unknown, cookie: string): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
    redirect: "manual",
  });
}

async function apiPut(path: string, body: unknown, cookie: string): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
    redirect: "manual",
  });
}

async function apiDelete(path: string, cookie: string): Promise<Response> {
  return fetch(`${BASE}${path}`, {
    method: "DELETE",
    headers: { ...(cookie ? { cookie } : {}) },
    redirect: "manual",
  });
}

// ── Test Credentials (from seed.ts) ──
const ACCOUNTS: { label: string; email: string; password: string; role: string }[] = [
  { label: "Admin",           email: "admin@school.com",        password: "Admin@123",      role: "SUPER_ADMIN" },
  { label: "Principal",       email: "principal@school.com",    password: "Principal@123",  role: "PRINCIPAL" },
  { label: "Bursar",          email: "bursar@school.com",       password: "Bursar@123",     role: "BURSAR" },
  { label: "Teacher",         email: "teacher@school.com",      password: "Teacher@123",    role: "TEACHER" },
  { label: "Parent",          email: "parent@school.com",       password: "Parent@123",     role: "PARENT" },
  { label: "Receptionist",    email: "receptionist@school.com", password: "Reception@123",  role: "RECEPTIONIST" },
  { label: "Librarian",       email: "librarian@school.com",    password: "Library@123",    role: "LIBRARIAN" },
];

const TEST_STUDENT = {
  firstName: "E2E",
  lastName: "TestStudent",
  gender: "Male",
  admissionNumber: `E2E-${Date.now()}`,
};

// ── Test Runner ──
async function main() {
  console.log(`\n═══ E2E Test Suite ═══\n  Target: ${BASE}\n`);

  // ── 1. Health Check ──
  console.log("\n── Health Check ──");
  try {
    const healthRes = await fetch(`${BASE}/api/auth/csrf`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    assert("Server is reachable", healthRes.ok, `Status ${healthRes.status}`);
  } catch {
    assert("Server is reachable", false, "Could not connect — is the dev server running?");
    printReport();
    process.exit(1);
  }

  // Debug: Check CSRF response
  const debugCsrf = await fetch(`${BASE}/api/auth/csrf`, { cache: "no-store" });
  const debugCsrfBody = await debugCsrf.json();
  const debugCsrfCookies = debugCsrf.headers.getSetCookie?.() ?? [];
  assert("CSRF endpoint returns token", !!debugCsrfBody.csrfToken);
  assert("CSRF endpoint sets cookie", debugCsrfCookies.length > 0, `Got ${debugCsrfCookies.length} cookies`);

  // Debug: Check session before login
  const sessionBefore = await fetch(`${BASE}/api/auth/session`, { cache: "no-store" });
  const sessionBeforeBody = await sessionBefore.json();
  assert("No active session before login", !sessionBeforeBody?.user,
    sessionBeforeBody?.user ? `Session exists: ${JSON.stringify(sessionBeforeBody.user)}` : "OK");

  // ── 2. Authentication Tests ──
  console.log("\n── Authentication (all roles) ──");
  const sessions = new Map<string, string>();
  for (const acct of ACCOUNTS) {
    const cookie = await login(acct.email, acct.password);
    const ok = cookie !== null;
    assert(`Login: ${acct.label} (${acct.role})`, ok, ok ? "Session cookie obtained" : "Login failed");
    if (cookie) sessions.set(acct.role, cookie);
  }

  // Bad credentials
  const badCookie = await login("admin@school.com", "wrongpassword");
  assert("Login with wrong password is rejected", badCookie === null);

  // If no one could log in, stop early
  if (sessions.size === 0) {
    assert("At least one role can log in", false, "Zero successful logins — check server seed data");
    printReport();
    process.exit(1);
  }

  // ── 3. Role-based Dashboard Access ──
  console.log("\n── Dashboard Page Access ──");
  for (const [role, cookie] of sessions) {
    const res = await apiGet("/dashboard", cookie);
    assert(`${role} can access /dashboard`, res.ok || res.status === 200, `Status ${res.status}`);
  }

  // ── 4. Student CRUD (as first available admin-capable role) ──
  console.log("\n── Student CRUD ──");
  const adminRole = sessions.has("SUPER_ADMIN") ? "SUPER_ADMIN" : sessions.keys().next().value;
  const adminCookie = sessions.get(adminRole!)!;

  // CREATE
  const createRes = await apiPost("/api/students", {
    ...TEST_STUDENT,
    dateOfBirth: "2010-01-15",
    address: "123 Test Street",
    phone: "080E2ETEST00",
  }, adminCookie);
  const createBody = await createRes.json();
  const studentId = createBody?.data?.id;
  assert("Create student: HTTP 201", createRes.status === 201, `Status ${createRes.status}`);
  assert("Create student: has id", !!studentId);
  assert("Create student: admission number starts with AG-",
    createBody?.data?.admissionNumber?.startsWith("AG-"),
    `Got: ${createBody?.data?.admissionNumber}`);

  // READ
  if (studentId) {
    const getRes = await apiGet(`/api/students/${studentId}`, adminCookie);
    const getBody = await getRes.json();
    assert("Read student: HTTP 200", getRes.ok, `Status ${getRes.status}`);
    assert("Read student: firstName matches", getBody?.data?.firstName === TEST_STUDENT.firstName);
    assert("Read student: lastName matches", getBody?.data?.lastName === TEST_STUDENT.lastName);

    // UPDATE
    const updateRes = await apiPut(`/api/students/${studentId}`, {
      phone: "080UPDATED00",
      address: "456 Updated Avenue",
    }, adminCookie);
    const updateBody = await updateRes.json();
    assert("Update student: HTTP 200", updateRes.ok, `Status ${updateRes.status}`);
    assert("Update student: phone changed", updateBody?.data?.phone === "080UPDATED00");
    assert("Update student: address changed", updateBody?.data?.address === "456 Updated Avenue");

    // SOFT DELETE
    const deleteRes = await apiDelete(`/api/students/${studentId}`, adminCookie);
    assert("Delete student: HTTP 200", deleteRes.ok, `Status ${deleteRes.status}`);

    // Verify soft-deleted
    const getDeletedRes = await apiGet(`/api/students/${studentId}`, adminCookie);
    assert("Soft-deleted student returns 404", getDeletedRes.status === 404,
      `Expected 404, got ${getDeletedRes.status}`);
  }

  // Student list
  const listRes = await apiGet("/api/students?page=1&limit=10", adminCookie);
  assert("Student list: HTTP 200", listRes.ok, `Status ${listRes.status}`);
  const listBody = await listRes.json();
  assert("Student list: has data array", Array.isArray(listBody?.data));
  assert("Student list: has meta.total", !!listBody?.meta?.total);

  // ── 5. RBAC: Authorization Enforcement ──
  console.log("\n── RBAC Authorization Enforcement ──");

  // TEACHER cannot create students
  const teacherCookie = sessions.get("TEACHER");
  if (teacherCookie) {
    const teacherCreateRes = await apiPost("/api/students", TEST_STUDENT, teacherCookie);
    assert("Teacher cannot create student", teacherCreateRes.status === 403,
      `Expected 403, got ${teacherCreateRes.status}`);

    const teacherReadRes = await apiGet("/api/students?page=1&limit=5", teacherCookie);
    assert("Teacher can read students", teacherReadRes.ok, `Status ${teacherReadRes.status}`);
  }

  // PARENT cannot access students
  const parentCookie = sessions.get("PARENT");
  if (parentCookie) {
    const parentStudentsRes = await apiGet("/api/students", parentCookie);
    assert("Parent cannot list students", parentStudentsRes.status === 403,
      `Expected 403, got ${parentStudentsRes.status}`);
  }

  // BURSAR cannot create students
  const bursarCookie = sessions.get("BURSAR");
  if (bursarCookie) {
    const bursarCreateRes = await apiPost("/api/students", TEST_STUDENT, bursarCookie);
    assert("Bursar cannot create student", bursarCreateRes.status === 403,
      `Expected 403, got ${bursarCreateRes.status}`);
  }

  // RECEPTIONIST can create students
  const receptionCookie = sessions.get("RECEPTIONIST");
  if (receptionCookie) {
    const receptionCreateRes = await apiPost("/api/students", {
      ...TEST_STUDENT,
      admissionNumber: `E2E-REC-${Date.now()}`,
    }, receptionCookie);
    assert("Receptionist can create student", receptionCreateRes.status === 201,
      `Expected 201, got ${receptionCreateRes.status}`);

    // Clean up receptionist's test student
    const receptionBody = await receptionCreateRes.json();
    if (receptionBody?.data?.id) {
      await apiDelete(`/api/students/${receptionBody.data.id}`, adminCookie);
    }
  }

  // ── 6. Enrollment Data API ──
  console.log("\n── Enrollment Data API ──");
  try {
    const enrolRes = await apiGet("/api/enrollment-data", adminCookie);
    assert("Enrollment data: HTTP 200", enrolRes.ok, `Status ${enrolRes.status}`);
    if (enrolRes.ok) {
      const enrolBody = await enrolRes.json();
      assert("Enrollment data: has classes", Array.isArray(enrolBody?.data?.classes));
      assert("Enrollment data: has houses", Array.isArray(enrolBody?.data?.houses));
      if (enrolBody?.data?.classes?.length > 0) {
        assert("Enrollment data: classes[0].id exists", !!enrolBody.data.classes[0].id);
        assert("Enrollment data: classes[0].name exists", !!enrolBody.data.classes[0].name);
      }
    }
  } catch {
    assert("Enrollment data: HTTP 200", false, "Request threw an exception");
  }

  // ── 7. Unauthenticated Access ──
  console.log("\n── Unauthenticated Access ──");
  const noAuthRes = await apiGet("/dashboard", "");
  assert("Unauthenticated /dashboard redirects", noAuthRes.status === 307 || noAuthRes.status === 302,
    `Expected redirect, got ${noAuthRes.status}`);

  const noAuthStudentsRes = await apiGet("/api/students", "");
  assert("Unauthenticated /api/students returns 401", noAuthStudentsRes.status === 401,
    `Expected 401, got ${noAuthStudentsRes.status}`);

  // ── 8. Public API Access ──
  console.log("\n── Public API Access ──");
  try {
    const pubEnrolRes = await apiGet("/api/enrollment-data", "");
    assert("Enrollment data accessible without auth", pubEnrolRes.ok,
      `Status ${pubEnrolRes.status}`);
  } catch {
    assert("Enrollment data accessible without auth", false, "Request threw an exception");
  }

  printReport();
}

function printReport() {
  const total = passedCount + failedCount;
  const pct = total > 0 ? Math.round((passedCount / total) * 100) : 0;

  console.log(`\n${"=".repeat(55)}`);
  console.log(`  RESULTS: ${passedCount}/${total} passed (${pct}%)`);
  console.log(`${"=".repeat(55)}`);

  if (failedCount > 0) {
    console.log("\n  FAILED TESTS:");
    for (const r of results) {
      if (!r.passed) console.log(`    ✗ ${r.name}${r.detail ? `  → ${r.detail}` : ""}`);
    }
  }
  console.log("");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
