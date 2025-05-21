
// Thread-related types

// Form data for creating a thread
export interface ThreadFormData {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  format?: "plain" | "markdown" | "html";
}

// Form data for creating a thread comment
export interface ThreadCommentFormData {
  content: string;
  parent_id?: string;
}

// Thread data returned from the database
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

// Thread comment data returned from the database
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
  replies?: ThreadComment[];
}

// Thread upvote data
export interface ThreadUpvote {
  id: string;
  thread_id: string | null;
  comment_id: string | null;
  user_id: string;
  created_at: string;
}

// Thread flag data
export interface ThreadFlag {
  id: string;
  thread_id: string | null;
  comment_id: string | null;
  user_id: string;
  reason: string;
  status: string;
  moderator_id: string | null;
  resolved_at: string | null;
  created_at: string;
}

// Thread subscription data
export interface ThreadSubscription {
  id: string;
  thread_id: string;
  user_id: string;
  created_at: string;
}

// Thread notification data
export interface ThreadNotification {
  id: string;
  thread_id: string;
  comment_id: string | null;
  user_id: string;
  actor_id: string;
  type: string;
  is_read: boolean;
  created_at: string;
}
