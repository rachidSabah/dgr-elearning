import { db } from "@/lib/db";
import { randomBytes, scryptSync } from "crypto";

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const verifyHash = scryptSync(password, salt, 64).toString("hex");
  return verifyHash === hash;
}

// Simple session token generation
export function generateToken(): string {
  return randomBytes(32).toString("hex");
}

// Get or create session
export async function createSession(userId: string, userAgent?: string, ipAddress?: string) {
  const token = generateToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await db.session.create({
    data: { userId, token, expiresAt, userAgent, ipAddress },
  });

  return token;
}

// Verify session token
export async function verifySession(token: string) {
  if (!token) return null;
  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session) return null;
  if (session.expiresAt < new Date()) {
    await db.session.delete({ where: { id: session.id } });
    return null;
  }
  return session;
}

// Role hierarchy for permission checking
const ROLE_HIERARCHY: Record<string, number> = {
  STUDENT: 0,
  CONTENT_EDITOR: 1,
  INSTRUCTOR: 2,
  ACADEMY_ADMIN: 3,
  SUPER_ADMIN: 4,
};

export function hasPermission(userRole: string, requiredRole: string): boolean {
  return (ROLE_HIERARCHY[userRole] || 0) >= (ROLE_HIERARCHY[requiredRole] || 0);
}

// Check if user can access admin area
export function isAdmin(role: string): boolean {
  return ["SUPER_ADMIN", "ACADEMY_ADMIN", "INSTRUCTOR", "CONTENT_EDITOR"].includes(role);
}

// Get current user from request cookies
export async function getCurrentUser(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const tokenMatch = cookieHeader.match(/session-token=([^;]+)/);
  if (!tokenMatch) return null;
  const session = await verifySession(tokenMatch[1]);
  return session?.user || null;
}

// Default admin credentials (for initial setup)
export const DEFAULT_ADMIN = {
  email: "admin@dgr-academy.com",
  password: "Admin@2024",
  name: "Super Admin",
  role: "SUPER_ADMIN",
};
