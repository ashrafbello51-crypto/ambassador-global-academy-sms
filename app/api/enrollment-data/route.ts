import { prisma } from "@/lib/prisma";
import { success, serverError } from "@/lib/utils/api-response";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [classes, houses] = await Promise.all([
      prisma.schoolClass.findMany({
        orderBy: { order: "asc" },
        select: {
          id: true,
          name: true,
          category: true,
          streams: { select: { id: true, name: true }, orderBy: { name: "asc" } },
        },
      }),
      prisma.studentHouse.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, color: true },
      }),
    ]);
    return success({ classes, houses });
  } catch (e) {
    return serverError(e);
  }
}
