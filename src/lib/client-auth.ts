"use client";

// Client-side authentication system for static hosting (Cloudflare Pages)
// Uses localStorage with browser-compatible password hashing
// No Node.js dependencies - works entirely in the browser

// ============================================================
// TYPES
// ============================================================

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

// ============================================================
// BROWSER-COMPATIBLE PASSWORD HASHING
// Uses a simple salted hash that works in all browsers
// ============================================================

function generateSalt(): string {
  const arr = new Uint8Array(16);
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < 16; i++) arr[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Simple but functional hash using built-in browser APIs
function hashPassword(password: string): string {
  const salt = generateSalt();
  // Use a simple SHA-like hash with salt (synchronous, browser-compatible)
  let hash = 0;
  const combined = salt + password + "dgr-academy-secret";
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Make it longer and more complex with multiple rounds
  let result = salt + ":";
  let h = hash;
  for (let round = 0; round < 100; round++) {
    h = ((h * 31 + combined.charCodeAt(round % combined.length)) ^ (h >> 3)) >>> 0;
    result += h.toString(16).padStart(8, "0");
  }
  return result;
}

function verifyPassword(password: string, stored: string): boolean {
  const colonIdx = stored.indexOf(":");
  if (colonIdx < 0) return false;
  const salt = stored.substring(0, colonIdx);

  // Recompute hash with same salt
  let hash = 0;
  const combined = salt + password + "dgr-academy-secret";
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  let result = salt + ":";
  let h = hash;
  for (let round = 0; round < 100; round++) {
    h = ((h * 31 + combined.charCodeAt(round % combined.length)) ^ (h >> 3)) >>> 0;
    result += h.toString(16).padStart(8, "0");
  }
  return result === stored;
}

// ============================================================
// STORAGE KEYS
// ============================================================

const USERS_KEY = "dgr-academy-users";
const SESSION_KEY = "dgr-academy-session";

// ============================================================
// USER MANAGEMENT
// ============================================================

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

// Initialize default admin if no users exist
export function initializeAuth() {
  if (typeof window === "undefined") return;
  const users = getAllUsers();
  if (users.length === 0) {
    const admin: StoredUser = {
      id: "admin-001",
      email: "admin@dgr-academy.com",
      name: "Super Admin",
      role: "SUPER_ADMIN",
      department: "Administration",
      isActive: true,
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword("Admin@2024"),
    };

    const student: StoredUser = {
      id: "student-001",
      email: "student@dgr-academy.com",
      name: "Demo Student",
      role: "STUDENT",
      department: "Cabin Crew",
      isActive: true,
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword("Student@2024"),
      enrolledCourses: ["dangerous-goods-regulations", "cabin-crew-first-aid-training"],
    };

    // Create a few more demo users
    const instructor: StoredUser = {
      id: "instructor-001",
      email: "instructor@dgr-academy.com",
      name: "Sarah Mitchell",
      role: "INSTRUCTOR",
      department: "Safety Training",
      isActive: true,
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword("Instructor@2024"),
    };

    const student2: StoredUser = {
      id: "student-002",
      email: "ahmed@example.com",
      name: "Ahmed Hassan",
      role: "STUDENT",
      department: "Cabin Crew",
      isActive: true,
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword("Student@2024"),
      enrolledCourses: ["dangerous-goods-regulations"],
    };

    const student3: StoredUser = {
      id: "student-003",
      email: "maria@example.com",
      name: "Maria Garcia",
      role: "STUDENT",
      department: "Cabin Crew",
      isActive: false, // Suspended user for demo
      createdAt: new Date().toISOString(),
      passwordHash: hashPassword("Student@2024"),
      enrolledCourses: ["dangerous-goods-regulations", "cabin-crew-first-aid-training"],
    };

    saveUsers([admin, student, instructor, student2, student3]);
  }
}

export function getUserByEmail(email: string): StoredUser | null {
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getUserById(id: string): StoredUser | null {
  const users = getAllUsers();
  return users.find((u) => u.id === id) || null;
}

// ============================================================
// AUTHENTICATION
// ============================================================

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

  // Update last login
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx].lastLogin = new Date().toISOString();
    saveUsers(users);
  }

  // Create session (remove password hash)
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

export function isLoggedIn(): boolean {
  return getSession() !== null;
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

// ============================================================
// USER CRUD
// ============================================================

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
  if (idx < 0) {
    return { success: false, error: "User not found" };
  }

  // Prevent deactivating last super admin
  if (data.isActive === false && users[idx].role === "SUPER_ADMIN") {
    const activeSuperAdmins = users.filter((u) => u.role === "SUPER_ADMIN" && u.isActive);
    if (activeSuperAdmins.length <= 1) {
      return { success: false, error: "Cannot suspend the last super admin" };
    }
  }

  // Prevent self-suspension
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
  if (idx < 0) {
    return { success: false, error: "User not found" };
  }

  if (users[idx].role === "SUPER_ADMIN") {
    const superAdmins = users.filter((u) => u.role === "SUPER_ADMIN");
    if (superAdmins.length <= 1) {
      return { success: false, error: "Cannot delete the last super admin" };
    }
  }

  const currentUser = getSession();
  if (currentUser?.id === id) {
    return { success: false, error: "You cannot delete your own account" };
  }

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

// ============================================================
// ROLE PERMISSIONS
// ============================================================

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

// ============================================================
// DEFAULT CREDENTIALS
// ============================================================

export const DEFAULT_CREDENTIALS = {
  admin: {
    email: "admin@dgr-academy.com",
    password: "Admin@2024",
  },
  student: {
    email: "student@dgr-academy.com",
    password: "Student@2024",
  },
  instructor: {
    email: "instructor@dgr-academy.com",
    password: "Instructor@2024",
  },
};
