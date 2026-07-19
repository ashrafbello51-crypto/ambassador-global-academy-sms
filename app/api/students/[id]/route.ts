import { auth } from "@/lib/auth";
import { StudentService } from "@/lib/services/student.service";
import { updateStudentSchema } from "@/lib/validations/student.schema";
import { canRead, canUpdate, canDelete, getModuleForPath } from "@/lib/rbac";
import { success, badRequest, unauthorized, forbidden, notFound, serverError } from "@/lib/utils/api-response";

export const runtime = "nodejs";

async function checkAuth(perm: "read" | "update" | "delete") {
  const session = await auth();
  if (!session?.user?.id) return { error: unauthorized(), user: null };
  const mod = getModuleForPath("/dashboard/students");
  const permMap = { read: canRead, update: canUpdate, delete: canDelete };
  if (!permMap[perm](session.user.role, mod!)) return { error: forbidden(), user: null };
  return { error: null, user: { id: session.user.id, role: session.user.role } };
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error } = await checkAuth("read");
    if (error) return error;

    const student = await StudentService.getById(id);
    if (!student) return notFound("Student not found");
    return success(student);
  } catch (e) {
    return serverError(e);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error, user } = await checkAuth("update");
    if (error) return error;

    const body = await request.json();
    const parsed = updateStudentSchema.safeParse({ ...body, id });
    if (!parsed.success) return badRequest(parsed.error.errors[0]?.message ?? "Invalid input");

    const student = await StudentService.update(parsed.data, user!.id);
    if (!student) return notFound("Student not found");
    return success(student);
  } catch (e) {
    return serverError(e);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { error, user } = await checkAuth("delete");
    if (error) return error;

    const result = await StudentService.softDelete(id, user!.id);
    if (!result) return notFound("Student not found");
    return success({ message: "Student deleted successfully" });
  } catch (e) {
    return serverError(e);
  }
}
