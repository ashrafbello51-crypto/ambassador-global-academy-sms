import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashPassword = (password: string) => bcrypt.hashSync(password, 12);

  // Clear existing data in correct order
  await prisma.weeklyExpense.deleteMany();
  await prisma.weeklyAttendance.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.result.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.gradingSystem.deleteMany();
  await prisma.feeDiscount.deleteMany();
  await prisma.feePayment.deleteMany();
  await prisma.feeStructure.deleteMany();
  await prisma.scholarship.deleteMany();
  await prisma.studentGuardian.deleteMany();
  await prisma.guardian.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.student.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.department.deleteMany();
  await prisma.studentHouse.deleteMany();
  await prisma.stream.deleteMany();
  await prisma.schoolClass.deleteMany();
  await prisma.academicTerm.deleteMany();
  await prisma.academicSession.deleteMany();
  await prisma.passwordReset.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create SUPER_OWNER (hidden system account — NOT shown in any UI)
  const superOwner = await prisma.user.upsert({
    where: { email: "system@school.owner" },
    update: {},
    create: {
      email: "system@school.owner",
      name: "System Owner",
      password: hashPassword("SuperOwner@2026!"),
      role: "SUPER_OWNER" as Role,
      isActive: true,
    },
  });
  console.log(`Created SUPER_OWNER (hidden)`);

  // Create visible users
  const users = [
    { email: "admin@school.com", name: "System Administrator", role: "SUPER_ADMIN" as Role, password: "Admin@123" },
    { email: "principal@school.com", name: "Mr. John Principal", role: "PRINCIPAL" as Role, password: "Principal@123" },
    { email: "bursar@school.com", name: "Mr. Bursar Account", role: "BURSAR" as Role, password: "Bursar@123" },
    { email: "teacher@school.com", name: "Grace Okonkwo", role: "TEACHER" as Role, password: "Teacher@123" },
    { email: "parent@school.com", name: "Joseph Doe", role: "PARENT" as Role, password: "Parent@123" },
    { email: "receptionist@school.com", name: "Jane Receptionist", role: "RECEPTIONIST" as Role, password: "Reception@123" },
    { email: "librarian@school.com", name: "Sam Librarian", role: "LIBRARIAN" as Role, password: "Library@123" },
  ];

  const createdUsers = [];
  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { password: hashPassword(u.password) },
      create: {
        email: u.email,
        name: u.name,
        password: hashPassword(u.password),
        role: u.role,
        isActive: true,
      },
    });
    createdUsers.push(user);
    console.log(`Created user: ${u.email} (${u.role})`);
  }

  // Create academic session
  const session = await prisma.academicSession.create({
    data: {
      name: "2025/2026",
      isCurrent: true,
      startDate: new Date("2025-09-01"),
      endDate: new Date("2026-08-31"),
      terms: {
        create: [
          { name: "1st Term", isCurrent: true, startDate: new Date("2025-09-01"), endDate: new Date("2025-12-15") },
          { name: "2nd Term", isCurrent: false, startDate: new Date("2026-01-08"), endDate: new Date("2026-04-12") },
          { name: "3rd Term", isCurrent: false, startDate: new Date("2026-04-28"), endDate: new Date("2026-08-15") },
        ],
      },
    },
  });

  // Create classes
  const classData = [
    { name: "NUR2", category: "NURSERY" as const, order: 1 },
    { name: "PRY4", category: "PRIMARY" as const, order: 4 },
    { name: "PRY5", category: "PRIMARY" as const, order: 5 },
    { name: "JS1", category: "JUNIOR_SECONDARY" as const, order: 7 },
    { name: "JS2", category: "JUNIOR_SECONDARY" as const, order: 8 },
    { name: "JS3", category: "JUNIOR_SECONDARY" as const, order: 9 },
    { name: "SS1", category: "SENIOR_SECONDARY" as const, order: 10 },
    { name: "SS2", category: "SENIOR_SECONDARY" as const, order: 11 },
    { name: "SS3", category: "SENIOR_SECONDARY" as const, order: 12 },
  ];

  for (const c of classData) {
    await prisma.schoolClass.create({ data: c });
  }

  // Create streams
  const ss1 = await prisma.schoolClass.findFirst({ where: { name: "SS1" } });
  if (ss1) {
    await prisma.stream.create({ data: { classId: ss1.id, name: "Science" } });
    await prisma.stream.create({ data: { classId: ss1.id, name: "Commercial" } });
    await prisma.stream.create({ data: { classId: ss1.id, name: "Arts" } });
  }

  // Create houses
  for (const house of ["Red House", "Blue House", "Green House", "Yellow House"]) {
    await prisma.studentHouse.create({ data: { name: house } });
  }

  console.log("\nSeeding complete!\n");
  console.log("Default credentials:");
  console.log("==================");
  for (const u of users) {
    console.log(`${u.role.padEnd(15)}: ${u.email} / ${u.password}`);
  }
  console.log("\n⚠️  CHANGE THESE PASSWORDS IN PRODUCTION ⚠️");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
