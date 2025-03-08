
// Thread system types
export interface Thread {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  is_visible: boolean;
  upvotes_count: number;
  flags_count: number;
}

export interface ThreadComment {
  id: string;
  thread_id: string;
  parent_id: string | null;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  upvotes_count: number;
  flags_count: number;
  depth: number;
  // For nested comments rendering
  replies?: ThreadComment[];
}

export interface ThreadUpvote {
  id: string;
  thread_id: string | null;
  comment_id: string | null;
  user_id: string;
  created_at: string;
}

export interface ThreadFlag {
  id: string;
  thread_id: string | null;
  comment_id: string | null;
  user_id: string;
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'actioned';
  moderator_id: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface ThreadSubscription {
  id: string;
  thread_id: string;
  user_id: string;
  created_at: string;
}

export interface ThreadNotification {
  id: string;
  thread_id: string;
  comment_id: string | null;
  user_id: string;
  actor_id: string;
  type: 'new_thread' | 'new_comment' | 'upvote' | 'flag';
  is_read: boolean;
  created_at: string;
}

export type ThreadContentFormat = 'plain' | 'markdown' | 'html';

export interface ThreadFormData {
  title: string;
  content: string;
  category: string;
  tags: string[];
  format?: ThreadContentFormat;
}

export interface ThreadCommentFormData {
  content: string;
  parent_id?: string | null;
  format?: ThreadContentFormat;
}
