"use client";

// ============================================================
// Discussion Forum store (localStorage based)
// Storage key: dgr-academy-forum
// ============================================================

export interface Reply {
  id: string;
  author: string;
  content: string;
  timestamp: string; // ISO
}

export interface ForumPost {
  id: string;
  lessonId: string;
  author: string;
  content: string;
  timestamp: string; // ISO
  replies: Reply[];
}

const KEY = "dgr-academy-forum";

function readAll(): ForumPost[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(posts: ForumPost[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(posts));
  window.dispatchEvent(new CustomEvent("dgr-forum-updated"));
}

export function addPost(lessonId: string, author: string, content: string): ForumPost {
  if (!content.trim()) throw new Error("Content required");
  const all = readAll();
  const post: ForumPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    lessonId,
    author: author || "Anonymous",
    content: content.trim(),
    timestamp: new Date().toISOString(),
    replies: [],
  };
  all.push(post);
  writeAll(all);
  return post;
}

export function getPosts(lessonId: string): ForumPost[] {
  return readAll()
    .filter((p) => p.lessonId === lessonId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function addReply(postId: string, author: string, content: string): Reply | null {
  if (!content.trim()) return null;
  const all = readAll();
  const idx = all.findIndex((p) => p.id === postId);
  if (idx < 0) return null;
  const reply: Reply = {
    id: `reply-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    author: author || "Anonymous",
    content: content.trim(),
    timestamp: new Date().toISOString(),
  };
  all[idx].replies.push(reply);
  writeAll(all);
  return reply;
}

export function deletePost(postId: string): void {
  writeAll(readAll().filter((p) => p.id !== postId));
}

export function subscribeToForum(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => callback();
  window.addEventListener("dgr-forum-updated", handler);
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) handler();
  });
  return () => {
    window.removeEventListener("dgr-forum-updated", handler);
  };
}

export function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
}
