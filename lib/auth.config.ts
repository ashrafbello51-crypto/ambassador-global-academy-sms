import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth.schema";
import type { Role } from "@/lib/rbac-core";
import bcrypt from "bcryptjs";

function getAuthConfig() {
  return NextAuth({
    session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
      signIn: "/login",
    },
    providers: [
      Credentials({
        name: "credentials",
        credentials: {
          email: { label: "Email", type: "email" },
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
          const parsed = loginSchema.safeParse(credentials);
          if (!parsed.success) return null;

          const { email, password } = parsed.data;

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

          const isValid = bcrypt.compareSync(password, user.password);
          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as Role,
          };
        },
      }),
    ],
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.role = user.role;
          token.id = user.id as string;
        }
        return token;
      },
      async session({ session, token }) {
        if (token) {
          session.user.id = token.id as string;
          session.user.role = token.role as Role;
        }
        return session;
      },
    },
  });
}

let _auth: ReturnType<typeof getAuthConfig> | null = null;

function getAuth() {
  if (!_auth) {
    try {
      _auth = getAuthConfig();
    } catch (e) {
      console.error("[Auth.js] Failed to initialize:", e);
      throw e;
    }
  }
  return _auth;
}

const authResult = getAuth();
export const { handlers, signIn, signOut, auth } = authResult;
