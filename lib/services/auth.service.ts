import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

// Web Crypto API — usable in Edge Runtime
function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest("SHA-256", encoder.encode(data));
  return arrayBufferToHex(hashBuffer);
}

async function generateRandomBytes(length: number): Promise<string> {
  const buffer = new Uint8Array(length);
  crypto.getRandomValues(buffer);
  return arrayBufferToHex(buffer.buffer);
}

export class AuthService {
  static async verifyCredentials(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        isActive: true,
        deletedAt: true,
      },
    });

    if (!user || user.deletedAt || !user.isActive) return null;

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return null;

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  static async generatePasswordResetToken(userId: string): Promise<string> {
    // Invalidate any existing unused tokens for this user
    await prisma.passwordReset.updateMany({
      where: { userId, usedAt: null },
      data: { usedAt: new Date() },
    });

    const rawToken = await generateRandomBytes(32);
    const hashedToken = await sha256(rawToken);

    await prisma.passwordReset.create({
      data: {
        userId,
        token: hashedToken,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    return rawToken;
  }

  static async validatePasswordResetToken(token: string): Promise<string | null> {
    const hashedToken = await sha256(token);

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token: hashedToken },
      select: { userId: true, expires: true, usedAt: true },
    });

    if (!resetRecord || new Date() > resetRecord.expires || resetRecord.usedAt) {
      return null;
    }

    return resetRecord.userId;
  }

  static async resetPassword(token: string, newPassword: string): Promise<boolean> {
    const userId = await this.validatePasswordResetToken(token);
    if (!userId) return false;

    const hashedPassword = await this.hashPassword(newPassword);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordReset.updateMany({
        where: { userId, usedAt: null },
        data: { usedAt: new Date() },
      }),
      prisma.session.deleteMany({ where: { userId } }),
    ]);

    return true;
  }

  static async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true, role: true, isActive: true, deletedAt: true },
    });
  }
}
