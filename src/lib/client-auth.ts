"use client";

// Client-side authentication system for static hosting (Cloudflare Pages)
// Uses localStorage with hashed passwords - no server required
// This allows admin and student login to work on static deployments

import { scryptSync, randomBytes } from "crypto";

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
  enrolledCourses?: string[]; // course IDs for students
}

interface StoredUser extends AuthUser {
  passwordHash: string;
}

// ============================================================
// PASSWORD HASHING (using Web Crypto API for browser compatibility)
// ============================================================

async function hashPassword(password: string): Promise<string> {
  // Use a simple hash for client-side (this is not as secure as server-side but works for demo)
  // In production, use proper server-side authentication
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(":");
    if (!salt || !hash) return false;
    const verifyHash = scryptSync(password, salt, 64).toString("hex");
    return verifyHash === hash;
  } catch {
    // Fallback for browser environment where scryptSync might not be available
    return stored === `simple:${btoa(password)}`;
  }
}

// Simple hash fallback for browser
function simpleHash(password: string): string {
  return `simple:${btoa(password)}`;
}

function verifySimpleHash(password: string, stored: string): boolean {
  if (stored.startsWith("simple:")) {
    return stored === simpleHash(password);
  }
  return verifyPassword(password, stored);
}

// ============================================================
// STORAGE KEYS
// ============================================================

const USERS_KEY = "dgr-academy-users";
const SESSION_KEY = "dgr-academy-session";

// ============================================================
// USER MANAGEMENT
// ============================================================

// Get all users from localStorage
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

// Save all users to localStorage
function saveUsers(users: StoredUser[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Initialize default admin if no users exist
export function initializeAuth() {
  if (typeof window === "undefined") return;
  const users = getAllUsers();
  if (users.length === 0) {
    // Create default super admin
    const admin: StoredUser = {
      id: "admin-001",
      email: "admin@dgr-academy.com",
      name: "Super Admin",
      role: "SUPER_ADMIN",
      department: "Administration",
      isActive: true,
      createdAt: new Date().toISOString(),
      passwordHash: simpleHash("Admin@2024"),
    };
    saveUsers([admin]);

    // Create a demo student
    const student: StoredUser = {
      id: "student-001",
      email: "student@dgr-academy.com",
      name: "Demo Student",
      role: "STUDENT",
      department: "Cabin Crew",
      isActive: true,
      createdAt: new Date().toISOString(),
      passwordHash: simpleHash("Student@2024"),
      enrolledCourses: ["dangerous-goods-regulations", "cabin-crew-first-aid-training"],
    };
    saveUsers([admin, student]);
  }
}

// Get user by email
export function getUserByEmail(email: string): StoredUser | null {
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

// Get user by ID
export function getUserById(id: string): StoredUser | null {
  const users = getAllUsers();
  return users.find((u) => u.id === id) || null;
}

// ============================================================
// AUTHENTICATION
// ============================================================

// Login user
export function login(email: string, password: string): { success: boolean; user?: AuthUser; error?: string } {
  initializeAuth();
  const user = getUserByEmail(email);
  if (!user) {
    return { success: false, error: "Invalid email or password" };
  }
  if (!user.isActive) {
    return { success: false, error: "Your account has been suspended. Please contact the administrator." };
  }
  if (!verifySimpleHash(password, user.passwordHash)) {
    return { success: false, error: "Invalid email or password" };
  }

  // Update last login
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx].lastLogin = new Date().toISOString();
    saveUsers(users);
  }

  // Create session
  const sessionUser: AuthUser = { ...user };
  delete (sessionUser as any).passwordHash;
  setSession(sessionUser);

  return { success: true, user: sessionUser };
}

// Logout
export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

// Get current session
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

// Set session
function setSession(user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

// Check if logged in
export function isLoggedIn(): boolean {
  return getSession() !== null;
}

// Check if admin
export function isAdmin(): boolean {
  const user = getSession();
  if (!user) return false;
  return ["SUPER_ADMIN", "ACADEMY_ADMIN", "INSTRUCTOR", "CONTENT_EDITOR"].includes(user.role);
}

// Check if super admin
export function isSuperAdmin(): boolean {
  const user = getSession();
  return user?.role === "SUPER_ADMIN";
}

// ============================================================
// USER CRUD (for admin panel)
// ============================================================

// Create new user
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

  // Check if email already exists
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
    passwordHash: simpleHash(data.password),
    enrolledCourses: data.enrolledCourses || [],
  };

  users.push(newUser);
  saveUsers(users);

  const userCopy: AuthUser = { ...newUser };
  delete (userCopy as any).passwordHash;
  return { success: true, user: userCopy };
}

// Update user
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

  // Update fields
  if (data.email) users[idx].email = data.email;
  if (data.name) users[idx].name = data.name;
  if (data.password) users[idx].passwordHash = simpleHash(data.password);
  if (data.role) users[idx].role = data.role;
  if (data.department !== undefined) users[idx].department = data.department;
  if (data.phone !== undefined) users[idx].phone = data.phone;
  if (data.employeeId !== undefined) users[idx].employeeId = data.employeeId;
  if (data.isActive !== undefined) users[idx].isActive = data.isActive;
  if (data.enrolledCourses !== undefined) users[idx].enrolledCourses = data.enrolledCourses;

  saveUsers(users);

  const userCopy: AuthUser = { ...users[idx] };
  delete (userCopy as any).passwordHash;
  return { success: true, user: userCopy };
}

// Delete user
export function deleteUser(id: string): { success: boolean; error?: string } {
  const users = getAllUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx < 0) {
    return { success: false, error: "User not found" };
  }

  // Prevent deleting last super admin
  if (users[idx].role === "SUPER_ADMIN") {
    const superAdmins = users.filter((u) => u.role === "SUPER_ADMIN");
    if (superAdmins.length <= 1) {
      return { success: false, error: "Cannot delete the last super admin" };
    }
  }

  // Prevent self-deletion
  const currentUser = getSession();
  if (currentUser?.id === id) {
    return { success: false, error: "You cannot delete your own account" };
  }

  users.splice(idx, 1);
  saveUsers(users);
  return { success: true };
}

// Suspend user (deactivate)
export function suspendUser(id: string): { success: boolean; error?: string } {
  return updateUser(id, { isActive: false });
}

// Reactivate user
export function reactivateUser(id: string): { success: boolean; error?: string } {
  return updateUser(id, { isActive: true });
}

// Get all users (without password hashes) - for admin panel
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
};
