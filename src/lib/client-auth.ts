"use client";

// Client-side authentication system for static hosting (Cloudflare Pages)
// Uses localStorage with simple browser-compatible password hashing

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "ACADEMY_ADMIN" | "INSTRUCTOR" | "STUDENT" | "CONTENT_EDITOR";
  avatar?: string;
  department?: string;
  phone?: string;
  employeeId?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  enrolledCourses?: string[];
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

// Simple, reliable, browser-compatible password hashing
// Uses btoa (Base64) with a salt - works in ALL browsers, no Node.js needed
function hashPassword(password: string): string {
  // Generate a random salt using Math.random (works everywhere)
  const salt = Math.random().toString(36).substring(2, 18);
  // Simple hash: salt + password encoded in base64
  return btoa(salt + ":" + password + ":dgr-academy");
}

function verifyPassword(password: string, stored: string): boolean {
  try {
    const decoded = atob(stored);
    // Format: salt:password:dgr-academy
    const parts = decoded.split(":");
    if (parts.length !== 3) return false;
    return parts[1] === password && parts[2] === "dgr-academy";
  } catch {
    return false;
  }
}

const USERS_KEY = "dgr-academy-users-v2";
const SESSION_KEY = "dgr-academy-session-v2";

export function getAllUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(USERS_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function initializeAuth() {
  if (typeof window === "undefined") return;

  // Clear old format data if exists
  const oldData = localStorage.getItem("dgr-academy-users");
  if (oldData) {
    localStorage.removeItem("dgr-academy-users");
  }
  const oldSession = localStorage.getItem("dgr-academy-session");
  if (oldSession) {
    localStorage.removeItem("dgr-academy-session");
  }

  // Check if v2 data exists
  const users = getAllUsers();
  if (users.length === 0) {
    const defaultUsers: StoredUser[] = [
      {
        id: "admin-001",
        email: "admin@dgr-academy.com",
        name: "Super Admin",
        role: "SUPER_ADMIN",
        department: "Administration",
        isActive: true,
        createdAt: new Date().toISOString(),
        passwordHash: hashPassword("Admin@2024"),
      },
      {
        id: "student-001",
        email: "student@dgr-academy.com",
        name: "Demo Student",
        role: "STUDENT",
        department: "Cabin Crew",
        isActive: true,
        createdAt: new Date().toISOString(),
        passwordHash: hashPassword("Student@2024"),
        enrolledCourses: ["dangerous-goods-regulations", "cabin-crew-first-aid-training"],
      },
      {
        id: "instructor-001",
        email: "instructor@dgr-academy.com",
        name: "Sarah Mitchell",
        role: "INSTRUCTOR",
        department: "Safety Training",
        isActive: true,
        createdAt: new Date().toISOString(),
        passwordHash: hashPassword("Instructor@2024"),
      },
      {
        id: "student-002",
        email: "ahmed@example.com",
        name: "Ahmed Hassan",
        role: "STUDENT",
        department: "Cabin Crew",
        isActive: true,
        createdAt: new Date().toISOString(),
        passwordHash: hashPassword("Student@2024"),
        enrolledCourses: ["dangerous-goods-regulations"],
      },
      {
        id: "student-003",
        email: "maria@example.com",
        name: "Maria Garcia",
        role: "STUDENT",
        department: "Cabin Crew",
        isActive: false,
        createdAt: new Date().toISOString(),
        passwordHash: hashPassword("Student@2024"),
        enrolledCourses: ["dangerous-goods-regulations", "cabin-crew-first-aid-training"],
      },
    ];
    saveUsers(defaultUsers);
  }
}

export function getUserByEmail(email: string): StoredUser | null {
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function login(email: string, password: string): { success: boolean; user?: AuthUser; error?: string } {
  initializeAuth();
  const user = getUserByEmail(email);
  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }
  if (!user.isActive) {
    return { success: false, error: "Your account has been suspended. Please contact the administrator." };
  }
  if (!verifyPassword(password, user.passwordHash)) {
    return { success: false, error: "Invalid email or password" };
  }

  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx].lastLogin = new Date().toISOString();
    saveUsers(users);
  }

  const { passwordHash, ...sessionUser } = user;
  setSession(sessionUser as AuthUser);
  return { success: true, user: sessionUser as AuthUser };
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function setSession(user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function isAdmin(): boolean {
  const user = getSession();
  if (!user) return false;
  return ["SUPER_ADMIN", "ACADEMY_ADMIN", "INSTRUCTOR", "CONTENT_EDITOR"].includes(user.role);
}

export function isSuperAdmin(): boolean {
  const user = getSession();
  return user?.role === "SUPER_ADMIN";
}

export function createUser(data: {
  email: string;
  name: string;
  password: string;
  role: AuthUser["role"];
  department?: string;
  phone?: string;
  employeeId?: string;
  enrolledCourses?: string[];
}): { success: boolean; user?: AuthUser; error?: string } {
  initializeAuth();
  const users = getAllUsers();
  if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
    return { success: false, error: "Email already registered" };
  }

  const newUser: StoredUser = {
    id: `user-${Date.now()}`,
    email: data.email,
    name: data.name,
    role: data.role,
    department: data.department,
    phone: data.phone,
    employeeId: data.employeeId,
    isActive: true,
    createdAt: new Date().toISOString(),
    passwordHash: hashPassword(data.password),
    enrolledCourses: data.enrolledCourses || [],
  };

  users.push(newUser);
  saveUsers(users);

  const { passwordHash, ...userCopy } = newUser;
  return { success: true, user: userCopy as AuthUser };
}

export function updateUser(id: string, data: Partial<{
  email: string;
  name: string;
  password: string;
  role: AuthUser["role"];
  department: string;
  phone: string;
  employeeId: string;
  isActive: boolean;
  enrolledCourses: string[];
}>): { success: boolean; user?: AuthUser; error?: string } {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return { success: false, error: "User not found" };

  if (data.isActive === false && users[idx].role === "SUPER_ADMIN") {
    const activeSuperAdmins = users.filter((u) => u.role === "SUPER_ADMIN" && u.isActive);
    if (activeSuperAdmins.length <= 1) {
      return { success: false, error: "Cannot suspend the last super admin" };
    }
  }

  const currentUser = getSession();
  if (data.isActive === false && currentUser?.id === id) {
    return { success: false, error: "You cannot suspend your own account" };
  }

  if (data.email) users[idx].email = data.email;
  if (data.name) users[idx].name = data.name;
  if (data.password) users[idx].passwordHash = hashPassword(data.password);
  if (data.role) users[idx].role = data.role;
  if (data.department !== undefined) users[idx].department = data.department;
  if (data.phone !== undefined) users[idx].phone = data.phone;
  if (data.employeeId !== undefined) users[idx].employeeId = data.employeeId;
  if (data.isActive !== undefined) users[idx].isActive = data.isActive;
  if (data.enrolledCourses !== undefined) users[idx].enrolledCourses = data.enrolledCourses;

  saveUsers(users);

  const { passwordHash, ...userCopy } = users[idx];
  return { success: true, user: userCopy as AuthUser };
}

export function deleteUser(id: string): { success: boolean; error?: string } {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) return { success: false, error: "User not found" };

  if (users[idx].role === "SUPER_ADMIN") {
    const superAdmins = users.filter((u) => u.role === "SUPER_ADMIN");
    if (superAdmins.length <= 1) return { success: false, error: "Cannot delete the last super admin" };
  }

  const currentUser = getSession();
  if (currentUser?.id === id) return { success: false, error: "You cannot delete your own account" };

  users.splice(idx, 1);
  saveUsers(users);
  return { success: true };
}

export function suspendUser(id: string): { success: boolean; error?: string } {
  return updateUser(id, { isActive: false });
}

export function reactivateUser(id: string): { success: boolean; error?: string } {
  return updateUser(id, { isActive: true });
}

export function getAllUsersSafe(): AuthUser[] {
  return getAllUsers().map((u) => {
    const { passwordHash, ...safe } = u;
    return safe as AuthUser;
  });
}

export function hasPermission(userRole: string, requiredRole: string): boolean {
  const hierarchy: Record<string, number> = {
    STUDENT: 0, CONTENT_EDITOR: 1, INSTRUCTOR: 2, ACADEMY_ADMIN: 3, SUPER_ADMIN: 4,
  };
  return (hierarchy[userRole] || 0) >= (hierarchy[requiredRole] || 0);
}

export const DEFAULT_CREDENTIALS = {
  admin: { email: "admin@dgr-academy.com", password: "Admin@2024" },
  student: { email: "student@dgr-academy.com", password: "Student@2024" },
  instructor: { email: "instructor@dgr-academy.com", password: "Instructor@2024" },
};
