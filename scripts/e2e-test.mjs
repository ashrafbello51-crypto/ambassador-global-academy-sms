// Comprehensive E2E Test Script
// Usage: node scripts/e2e-test.mjs

const BASE = process.argv[2] || "http://localhost:3000";

const results = [];
let passedCount = 0;
let failedCount = 0;

function assert(name, condition, detail) {
  results.push({ name, passed: condition, detail });
  if (condition) { passedCount++; process.stdout.write(`  ✓ ${name}\n`); }
  else { failedCount++; process.stdout.write(`  ✗ ${name}${detail ? ` — ${detail}` : ""}\n`); }
}

async function login(email, password) {
  try {
    const csrfRes = await fetch(`${BASE}/api/auth/csrf`, { cache: "no-store" });
    if (!csrfRes.ok) return null;
    const { csrfToken } = await csrfRes.json();
    const csrfCookies = (csrfRes.headers.getSetCookie?.() ?? [])
      .map(c => c.split(";")[0]).join("; ");

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

    const cookies = loginRes.headers.getSetCookie?.() ?? [];
    let sessionCookie = cookies.find(
      c => c.includes("authjs.session-token=") || c.includes("__Secure-authjs.session-token=")
    );

    // If not in response, follow redirect
    if (!sessionCookie) {
      const location = loginRes.headers.get("location");
      if (location) {
        const followRes = await fetch(`${BASE}${location}`, {
          headers: { ...(csrfCookies ? { Cookie: csrfCookies } : {}) },
          redirect: "manual",
        });
        const followCookies = followRes.headers.getSetCookie?.() ?? [];
        sessionCookie = followCookies.find(
          c => c.includes("authjs.session-token=") || c.includes("__Secure-authjs.session-token=")
        );
      }
    }

    return sessionCookie ? sessionCookie.split(";")[0] : null;
  } catch { return null; }
}

async function apiGet(path, cookie) {
  return fetch(`${BASE}${path}`, {
    headers: { ...(cookie ? { cookie } : {}) }, redirect: "manual",
  });
}

async function apiPost(path, body, cookie) {
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body), redirect: "manual",
  });
}

async function apiPut(path, body, cookie) {
  return fetch(`${BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(cookie ? { cookie } : {}) },
    body: JSON.stringify(body), redirect: "manual",
  });
}

async function apiDelete(path, cookie) {
  return fetch(`${BASE}${path}`, {
    method: "DELETE", headers: { ...(cookie ? { cookie } : {}) }, redirect: "manual",
  });
}

const ACCOUNTS = [
  { label: "Admin",        email: "admin@school.com",       password: "Admin@123",     role: "SUPER_ADMIN" },
  { label: "Principal",    email: "principal@school.com",   password: "Principal@123", role: "PRINCIPAL" },
  { label: "Bursar",       email: "bursar@school.com",      password: "Bursar@123",    role: "BURSAR" },
  { label: "Teacher",      email: "teacher@school.com",     password: "Teacher@123",   role: "TEACHER" },
  { label: "Parent",       email: "parent@school.com",      password: "Parent@123",    role: "PARENT" },
  { label: "Receptionist", email: "receptionist@school.com",password: "Reception@123", role: "RECEPTIONIST" },
  { label: "Librarian",    email: "librarian@school.com",   password: "Library@123",   role: "LIBRARIAN" },
];

const TEST_STUDENT = { firstName: "E2E", lastName: "TestStudent", gender: "Male", admissionNumber: `E2E-${Date.now()}` };

async function main() {
  console.log(`\n═══ E2E Test Suite ═══\n  Target: ${BASE}\n`);

  // 1. Health Check
  console.log("\n── Health Check ──");
  try {
    const r = await fetch(`${BASE}/api/auth/csrf`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    assert("Server is reachable", r.ok, `Status ${r.status}`);
  } catch { assert("Server is reachable", false, "Dev server not running?"); printReport(); process.exit(1); }

  // Debug CSRF
  const dCsrf = await fetch(`${BASE}/api/auth/csrf`, { cache: "no-store" });
  const dCsrfBody = await dCsrf.json();
  const dCsrfCook = dCsrf.headers.getSetCookie?.() ?? [];
  assert("CSRF returns token", !!dCsrfBody.csrfToken);
  assert("CSRF sets cookie", dCsrfCook.length > 0, `Got ${dCsrfCook.length} cookies`);

  // 2. Authentication
  console.log("\n── Authentication ──");
  const sessions = new Map();
  for (const acct of ACCOUNTS) {
    const cookie = await login(acct.email, acct.password);
    assert(`Login: ${acct.label} (${acct.role})`, cookie !== null, cookie ? "OK" : "Failed");
    if (cookie) sessions.set(acct.role, cookie);
  }
  assert("Wrong password rejected", await login("admin@school.com", "wrongpassword") === null);

  if (sessions.size === 0) {
    assert("At least one login works", false, "All 7 logins failed — seed data missing?");
    printReport(); process.exit(1);
  }

  // 3. Dashboard Access
  console.log("\n── Dashboard Access ──");
  for (const [role, cookie] of sessions) {
    const res = await apiGet("/dashboard", cookie);
    assert(`${role} /dashboard`, res.ok || res.status === 200, `Status ${res.status}`);
  }

  // 4. Student CRUD
  console.log("\n── Student CRUD ──");
  const adminCookie = sessions.get("SUPER_ADMIN") || sessions.values().next().value;

  const createRes = await apiPost("/api/students", {
    ...TEST_STUDENT, dateOfBirth: "2010-01-15", address: "123 Test St", phone: "080E2E00",
  }, adminCookie);
  const createBody = await createRes.json();
  const studentId = createBody?.data?.id;
  assert("Create: 201", createRes.status === 201, `Status ${createRes.status}`);
  assert("Create: has id", !!studentId);
  assert("Create: AG- prefix", createBody?.data?.admissionNumber?.startsWith("AG-"),
    `Got ${createBody?.data?.admissionNumber}`);

  if (studentId) {
    const getRes = await apiGet(`/api/students/${studentId}`, adminCookie);
    const getBody = await getRes.json();
    assert("Read: 200", getRes.ok, `Status ${getRes.status}`);
    assert("Read: firstName", getBody?.data?.firstName === TEST_STUDENT.firstName);
    assert("Read: lastName", getBody?.data?.lastName === TEST_STUDENT.lastName);

    const updRes = await apiPut(`/api/students/${studentId}`,
      { phone: "080UPDATED00", address: "456 Updated Ave" }, adminCookie);
    const updBody = await updRes.json();
    assert("Update: 200", updRes.ok, `Status ${updRes.status}`);
    assert("Update: phone", updBody?.data?.phone === "080UPDATED00");
    assert("Update: address", updBody?.data?.address === "456 Updated Ave");

    const delRes = await apiDelete(`/api/students/${studentId}`, adminCookie);
    assert("Delete: 200", delRes.ok, `Status ${delRes.status}`);

    const delGetRes = await apiGet(`/api/students/${studentId}`, adminCookie);
    assert("Deleted: 404", delGetRes.status === 404, `Status ${delGetRes.status}`);
  }

  const listRes = await apiGet("/api/students?page=1&limit=10", adminCookie);
  const listBody = await listRes.json();
  assert("List: 200", listRes.ok, `Status ${listRes.status}`);
  assert("List: data[]", Array.isArray(listBody?.data));
  assert("List: meta.total", !!listBody?.meta?.total);

  // 5. RBAC
  console.log("\n── RBAC ──");
  const teacherCookie = sessions.get("TEACHER");
  if (teacherCookie) {
    const r1 = await apiPost("/api/students", TEST_STUDENT, teacherCookie);
    assert("Teacher cannot create", r1.status === 403, `Got ${r1.status}`);
    const r2 = await apiGet("/api/students?page=1&limit=5", teacherCookie);
    assert("Teacher can read", r2.ok, `Status ${r2.status}`);
  }

  const parentCookie = sessions.get("PARENT");
  if (parentCookie) {
    const r = await apiGet("/api/students", parentCookie);
    assert("Parent cannot list students", r.status === 403, `Got ${r.status}`);
  }

  const bursarCookie = sessions.get("BURSAR");
  if (bursarCookie) {
    const r = await apiPost("/api/students", TEST_STUDENT, bursarCookie);
    assert("Bursar cannot create", r.status === 403, `Got ${r.status}`);
  }

  const receptionCookie = sessions.get("RECEPTIONIST");
  if (receptionCookie) {
    const r = await apiPost("/api/students", { ...TEST_STUDENT, admissionNumber: `E2E-REC-${Date.now()}` }, receptionCookie);
    assert("Receptionist can create", r.status === 201, `Got ${r.status}`);
    const body = await r.json();
    if (body?.data?.id) await apiDelete(`/api/students/${body.data.id}`, adminCookie);
  }

  // 6. Enrollment Data API
  console.log("\n── Enrollment Data ──");
  try {
    const r = await apiGet("/api/enrollment-data", adminCookie);
    assert("Enrol: 200", r.ok, `Status ${r.status}`);
    if (r.ok) {
      const b = await r.json();
      assert("Enrol: classes[]", Array.isArray(b?.data?.classes));
      assert("Enrol: houses[]", Array.isArray(b?.data?.houses));
    }
  } catch { assert("Enrol: 200", false, "Exception"); }

  // 7. Unauthenticated
  console.log("\n── Unauthenticated ──");
  const r1 = await apiGet("/dashboard", "");
  assert("No-auth /dashboard redirects", r1.status === 307 || r1.status === 302, `Got ${r1.status}`);
  const r2 = await apiGet("/api/students", "");
  assert("No-auth /api/students is 401", r2.status === 401, `Got ${r2.status}`);

  // 8. Public API
  console.log("\n── Public API ──");
  try {
    const r = await apiGet("/api/enrollment-data", "");
    assert("Public enrol data", r.ok, `Status ${r.status}`);
  } catch { assert("Public enrol data", false, "Exception"); }

  printReport();
}

function printReport() {
  const total = passedCount + failedCount;
  const pct = total > 0 ? Math.round(passedCount / total * 100) : 0;
  console.log(`\n${"=".repeat(55)}`);
  console.log(`  RESULTS: ${passedCount}/${total} passed (${pct}%)`);
  console.log(`${"=".repeat(55)}`);
  if (failedCount > 0) {
    console.log("\n  FAILED:");
    for (const r of results) if (!r.passed) console.log(`    ✗ ${r.name}${r.detail ? `  → ${r.detail}` : ""}`);
  }
  console.log("");
}

main().catch(e => { console.error("Fatal:", e); process.exit(1); });
