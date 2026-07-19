import { z } from "zod";

export const createStudentSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  middleName: z.string().max(100).optional(),
  dateOfBirth: z.string().optional(),
  gender: z.enum(["Male", "Female"]).optional(),
  address: z.string().max(500).optional(),
  phone: z.string().max(20).optional(),
  email: z.string().email().optional().or(z.literal("")),
  bloodGroup: z.string().max(10).optional(),
  medicalNotes: z.string().max(1000).optional(),
  classId: z.string().uuid().optional(),
  streamId: z.string().uuid().optional(),
  houseId: z.string().uuid().optional(),
  academicStatus: z.enum(["ACTIVE", "TRANSFERRED", "GRADUATED", "REPEATING", "WITHDRAWN"]).optional(),
  transferNotes: z.string().max(500).optional(),
});

export const updateStudentSchema = createStudentSchema.partial().extend({
  id: z.string().uuid(),
  isActive: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

export const studentQuerySchema = z.object({
  search: z.string().optional(),
  classId: z.string().uuid().optional(),
  status: z.enum(["ACTIVE", "TRANSFERRED", "GRADUATED", "REPEATING", "WITHDRAWN"]).optional(),
  isActive: z.coerce.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.enum(["firstName", "lastName", "admissionNumber", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type StudentQueryInput = z.infer<typeof studentQuerySchema>;
