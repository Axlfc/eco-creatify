// ForumThread, ForumComment, ForumTip types for help-for-help system
export interface ForumThread {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  helpType: "help-request" | "help-offer";
  isOpen: boolean;
}

export interface ForumComment {
  id: string;
  threadId: string;
  content: string;
  author: string;
  createdAt: string;
  parentId?: string;
}

export interface ForumTip {
  id: string;
  fromUser: string;
  toUser: string;
  threadId: string;
  commentId?: string;
  amount: number;
  createdAt: string;
  // TODO: Integrar con smart contract de propinas (Web3/Ethers.js)
}

// Moderation status for AutoMod
export type ModerationStatus = "clean" | "flagged" | "blocked";

export interface ModerationResult {
  status: ModerationStatus;
  reason?: string;
}

// Añadir reputación al modelo de usuario/perfil
export interface ForumUserProfile {
  username: string;
  displayName: string;
  reputation: number; // reputación acumulada
  avatarUrl?: string;
  isBlocked?: boolean;
}
