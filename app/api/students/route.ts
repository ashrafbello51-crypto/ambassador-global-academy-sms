import { auth } from "@/lib/auth";
import { StudentService } from "@/lib/services/student.service";
import { createStudentSchema, studentQuerySchema } from "@/lib/validations/student.schema";
import { canCreate, canRead, getModuleForPath } from "@/lib/rbac";
import { successWithMeta, created, badRequest, unauthorized, forbidden, serverError } from "@/lib/utils/api-response";

export const runtime = "nodejs";

async function checkAuth(perm: "create" | "read") {
  const session = await auth();
  if (!session?.user?.id) return { error: unauthorized(), user: null };
  const mod = getModuleForPath("/dashboard/students");
  const hasPerm = perm === "create" ? canCreate(session.user.role, mod!) : canRead(session.user.role, mod!);
  if (!hasPerm) return { error: forbidden(), user: null };
  return { error: null, user: { id: session.user.id, role: session.user.role } };
}

export async function GET(request: Request) {
  try {
    const { error } = await checkAuth("read");
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const parsed = studentQuerySchema.safeParse(Object.fromEntries(searchParams));
    if (!parsed.success) return badRequest(parsed.error.errors[0]?.message ?? "Invalid query");

    const result = await StudentService.list(parsed.data);
    return successWithMeta(result.students, result.meta);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(request: Request) {
  try {
    const { error, user } = await checkAuth("create");
    if (error) return error;

    const body = await request.json();
    const parsed = createStudentSchema.safeParse(body);
    if (!parsed.success) return badRequest(parsed.error.errors[0]?.message ?? "Invalid input");

    const student = await StudentService.create(parsed.data, user!.id);
    return created(student);
  } catch (e) {
    return serverError(e);
  }
}
