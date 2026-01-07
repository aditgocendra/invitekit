import type { DefaultSession, DefaultUser } from "next-auth";
type Role = "USER" | "ADMIN";

declare module "next-auth" {
  interface User extends DefaultUser {
    role?: Role; // opsional
  }

  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: Role; // opsional
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    role?: Role;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role?: Role; // PENTING: opsional, jangan required
  }
}
