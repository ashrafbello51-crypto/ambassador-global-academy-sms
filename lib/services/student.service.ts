import { prisma } from "@/lib/prisma";
import type { CreateStudentInput, UpdateStudentInput, StudentQueryInput } from "@/lib/validations/student.schema";
import type { Prisma } from "@prisma/client";

function generateAdmissionNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `AG-${year}-${random}`;
}

const studentInclude = {
  class: { select: { id: true, name: true } },
  stream: { select: { id: true, name: true } },
  house: { select: { id: true, name: true } },
  parentGuardians: {
    include: {
      guardian: { select: { id: true, firstName: true, lastName: true, phone: true, relationship: true } },
    },
  },
  _count: { select: { results: true, feePayments: true, attendanceRecords: true } },
} as const satisfies Prisma.StudentInclude;

type StudentWithRelations = Prisma.StudentGetPayload<{ include: typeof studentInclude }>;

export interface StudentResult {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  bloodGroup: string | null;
  medicalNotes: string | null;
  classId: string | null;
  streamId: string | null;
  houseId: string | null;
  enrollmentDate: string;
  isActive: boolean;
  isArchived: boolean;
  academicStatus: string;
  class: { id: string; name: string } | null;
  stream: { id: string; name: string } | null;
  house: { id: string; name: string } | null;
  parentGuardians: { guardian: { id: string; firstName: string; lastName: string; phone: string; relationship: string } }[];
  _count: { results: number; feePayments: number; attendanceRecords: number };
  createdAt: string;
}

function formatStudent(s: StudentWithRelations): StudentResult {
  return {
    id: s.id,
    admissionNumber: s.admissionNumber,
    firstName: s.firstName,
    lastName: s.lastName,
    middleName: s.middleName,
    dateOfBirth: s.dateOfBirth?.toISOString() ?? null,
    gender: s.gender,
    address: s.address,
    phone: s.phone,
    email: s.email,
    bloodGroup: s.bloodGroup,
    medicalNotes: s.medicalNotes,
    classId: s.classId,
    streamId: s.streamId,
    houseId: s.houseId,
    enrollmentDate: s.enrollmentDate.toISOString(),
    isActive: s.isActive,
    isArchived: s.isArchived,
    academicStatus: s.academicStatus,
    class: s.class,
    stream: s.stream,
    house: s.house,
    parentGuardians: s.parentGuardians ?? [],
    _count: s._count ?? { results: 0, feePayments: 0, attendanceRecords: 0 },
    createdAt: s.createdAt.toISOString(),
  };
}

export const StudentService = {
  async list(query: StudentQueryInput) {
    const { search, classId, status, isActive, page, pageSize, sort, order } = query;

    const where: Prisma.StudentWhereInput = { deletedAt: null };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { admissionNumber: { contains: search, mode: "insensitive" } },
      ];
    }
    if (classId) where.classId = classId;
    if (status) where.academicStatus = status;
    if (isActive !== undefined) where.isActive = isActive;

    const [total, students] = await Promise.all([
      prisma.student.count({ where }),
      prisma.student.findMany({
        where,
        include: studentInclude,
        orderBy: { [sort]: order },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      students: students.map(formatStudent),
      meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  },

  async getById(id: string) {
    const student = await prisma.student.findFirst({
      where: { id, deletedAt: null },
      include: studentInclude,
    });
    return student ? formatStudent(student) : null;
  },

  async create(input: CreateStudentInput, userId: string) {
    const admissionNumber = generateAdmissionNumber();
    const student = await prisma.student.create({
      data: {
        admissionNumber,
        firstName: input.firstName,
        lastName: input.lastName,
        middleName: input.middleName,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
        gender: input.gender,
        address: input.address,
        phone: input.phone,
        email: input.email || undefined,
        bloodGroup: input.bloodGroup,
        medicalNotes: input.medicalNotes,
        classId: input.classId,
        streamId: input.streamId,
        houseId: input.houseId,
        academicStatus: input.academicStatus ?? "ACTIVE",
        createdBy: userId,
        updatedBy: userId,
      },
      include: studentInclude,
    });
    return formatStudent(student);
  },

  async update(input: UpdateStudentInput, userId: string) {
    const existing = await prisma.student.findFirst({
      where: { id: input.id, deletedAt: null },
    });
    if (!existing) return null;

    const student = await prisma.student.update({
      where: { id: input.id },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        middleName: input.middleName,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
        gender: input.gender,
        address: input.address,
        phone: input.phone,
        email: input.email || undefined,
        bloodGroup: input.bloodGroup,
        medicalNotes: input.medicalNotes,
        classId: input.classId,
        streamId: input.streamId,
        houseId: input.houseId,
        academicStatus: input.academicStatus,
        isActive: input.isActive,
        isArchived: input.isArchived,
        updatedBy: userId,
      },
      include: studentInclude,
    });
    return formatStudent(student);
  },

  async softDelete(id: string, userId: string) {
    const existing = await prisma.student.findFirst({
      where: { id, deletedAt: null },
    });
    if (!existing) return null;

    await prisma.student.update({
      where: { id },
      data: { deletedAt: new Date(), updatedBy: userId },
    });
    return { id };
  },
};
