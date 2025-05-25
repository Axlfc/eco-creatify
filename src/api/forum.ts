// Mock API para hilos de ayuda y propinas
import { ForumThread, ForumComment, ForumTip, ModerationResult, ForumUserProfile } from "@/types/forum";

let threads: ForumThread[] = [];
let comments: ForumComment[] = [];
let tips: ForumTip[] = [];

// Mock usuarios/perfiles
let users: ForumUserProfile[] = [
  { username: "mockUser", displayName: "Mock User", reputation: 0, avatarUrl: undefined, isBlocked: false },
  { username: "ayudante", displayName: "Ayudante", reputation: 10, avatarUrl: undefined, isBlocked: false },
];

// Mock de moderación automática (AutoMod)
function autoModerate(text: string): ModerationResult {
  // Simple mock: flag si contiene palabras prohibidas
  const banned = ["spam", "ofensivo", "tonto", "idiota"];
  const found = banned.find(w => text.toLowerCase().includes(w));
  if (found) return { status: "flagged", reason: `Palabra prohibida: ${found}` };
  if (text.length < 3) return { status: "flagged", reason: "Mensaje demasiado corto" };
  return { status: "clean" };
}

export function getThreads() {
  return Promise.resolve([...threads]);
}

export function createThread(thread: Omit<ForumThread, "id" | "createdAt"> & { author: string }): Promise<ForumThread> {
  const newThread: ForumThread = {
    ...thread,
    id: Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
    isOpen: true,
  };
  threads.unshift(newThread);
  return Promise.resolve(newThread);
}

export function getThreadById(id: string): Promise<ForumThread | undefined> {
  return Promise.resolve(threads.find(t => t.id === id));
}

export function getComments(threadId: string): Promise<ForumComment[]> {
  return Promise.resolve(comments.filter(c => c.threadId === threadId));
}

export function addComment(comment: Omit<ForumComment, "id" | "createdAt">): Promise<ForumComment> {
  const newComment: ForumComment = {
    ...comment,
    id: Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
  };
  comments.push(newComment);
  return Promise.resolve(newComment);
}

export function sendTip(tip: Omit<ForumTip, "id" | "createdAt">): Promise<ForumTip> {
  const newTip: ForumTip = {
    ...tip,
    id: Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
  };
  tips.push(newTip);
  return Promise.resolve(newTip);
}

export function getTips(threadId: string): Promise<ForumTip[]> {
  return Promise.resolve(tips.filter(t => t.threadId === threadId));
}

// TODO: Documentar endpoints con Swagger/OpenAPI
// TODO: Integrar con backend real y Web3 en el futuro

export function moderateMessage(text: string): Promise<ModerationResult> {
  return Promise.resolve(autoModerate(text));
}

export function blockUser(username: string) {
  const user = users.find(u => u.username === username);
  if (user) user.isBlocked = true;
}

export function getUserProfile(username: string): Promise<ForumUserProfile | undefined> {
  return Promise.resolve(users.find(u => u.username === username));
}

export function updateReputation(username: string, delta: number) {
  const user = users.find(u => u.username === username);
  if (user) user.reputation += delta;
}
