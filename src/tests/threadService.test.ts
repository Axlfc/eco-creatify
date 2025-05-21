
import { supabase } from "@/integrations/supabase/client";
import { threadService } from "@/services/threadService";
import { testUtils } from "@/tests/utils/testUtils";
import { 
  Thread, 
  ThreadComment, 
  ThreadFormData, 
  ThreadCommentFormData 
} from "@/types/thread";

// Mock authentication
jest.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            user: {
              id: "test-user-id"
            }
          }
        }
      })
    },
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      like: jest.fn().mockReturnThis(),
      match: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: "test-thread-id"
        }, 
        error: null
      })
    })
  }
}));

const TEST_PREFIX = "TEST_JEST_";
let testUserId: string;
let testThreadId: string;

describe("Thread Service", () => {
  // Setup before tests
  beforeAll(async () => {
    testUserId = await testUtils.createTestUserSession();
  });
  
  // Clean up after tests
  afterAll(async () => {
    await testUtils.cleanupTestThreads(TEST_PREFIX);
  });
  
  // Thread creation tests
  describe("Thread Creation", () => {
    it("should create a thread with basic text content", async () => {
      const threadData: ThreadFormData = {
        title: `${TEST_PREFIX}Basic Text Thread`,
        content: "This is a basic text thread for testing.",
        category: "test-category",
        tags: ["test"]
      };
      
      const thread = await threadService.createThread(threadData);
      expect(thread).toBeTruthy();
      expect(thread!.id).toBeTruthy();
      testThreadId = thread!.id;
    });
    
    it("should create a thread with markdown formatting", async () => {
      const threadData: ThreadFormData = {
        title: `${TEST_PREFIX}Markdown Thread`,
        content: "# Header\n**Bold text** and *italic text*",
        category: "test-category",
        tags: ["test", "markdown"],
        format: "markdown"
      };
      
      const thread = await threadService.createThread(threadData);
      expect(thread).toBeTruthy();
    });
    
    it("should create a thread with links", async () => {
      const threadData: ThreadFormData = {
        title: `${TEST_PREFIX}Thread with Links`,
        content: "Check out this link: https://example.com and [this one](https://example.org)",
        category: "test-category",
        tags: ["test", "links"]
      };
      
      const thread = await threadService.createThread(threadData);
      expect(thread).toBeTruthy();
    });
    
    it("should reject thread creation if user is not authenticated", async () => {
      // Override auth mock for this test
      (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
        data: { session: null }
      });
      
      const threadData: ThreadFormData = {
        title: `${TEST_PREFIX}Unauthenticated Thread`,
        content: "This should fail",
        category: "test-category",
        tags: []
      };
      
      await expect(threadService.createThread(threadData)).rejects.toThrow();
    });
  });
  
  // Comment tests
  describe("Thread Comments", () => {
    beforeEach(() => {
      // Reset mock counts
      jest.clearAllMocks();
    });
    
    it("should add a comment to a thread", async () => {
      const commentData: ThreadCommentFormData = {
        content: "This is a test comment"
      };
      
      const comment = await threadService.addComment(testThreadId, commentData);
      expect(comment).toBeTruthy();
    });
    
    it("should add a nested reply to a comment", async () => {
      const commentData: ThreadCommentFormData = {
        content: "This is a test reply",
        parent_id: "test-comment-id"
      };
      
      const comment = await threadService.addComment(testThreadId, commentData);
      expect(comment).toBeTruthy();
    });
    
    it("should build comment tree from flat comments", () => {
      // Create test comments array
      const comments: ThreadComment[] = [
        {
          id: "comment1",
          thread_id: "thread1",
          parent_id: null,
          content: "Root comment 1",
          user_id: "user1",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          upvotes_count: 0,
          flags_count: 0,
          depth: 0
        },
        {
          id: "comment2",
          thread_id: "thread1",
          parent_id: "comment1",
          content: "Reply to root 1",
          user_id: "user2",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          upvotes_count: 0,
          flags_count: 0,
          depth: 1
        },
        {
          id: "comment3",
          thread_id: "thread1",
          parent_id: "comment2",
          content: "Reply to reply 1",
          user_id: "user3",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          upvotes_count: 0,
          flags_count: 0,
          depth: 2
        },
        {
          id: "comment4",
          thread_id: "thread1",
          parent_id: null,
          content: "Root comment 2",
          user_id: "user1",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          upvotes_count: 0,
          flags_count: 0,
          depth: 0
        }
      ];
      
      const tree = threadService.buildCommentTree(comments);
      
      // Should have 2 root comments
      expect(tree.length).toBe(2);
      
      // First root should have 1 reply
      expect(tree[0].replies!.length).toBe(1);
      
      // That reply should have 1 reply
      expect(tree[0].replies![0].replies!.length).toBe(1);
      
      // Second root should have no replies
      expect(tree[1].replies!.length).toBe(0);
    });
    
    it("should support deep nesting up to 10 levels", async () => {
      // Mock implementation for testing deep nesting
      const mockComments: ThreadComment[] = [];
      let parentId: string | null = null;
      
      // Create 10 levels of nested comments
      for (let i = 0; i < 10; i++) {
        const commentId = `deep-comment-${i}`;
        mockComments.push({
          id: commentId,
          thread_id: "thread1",
          parent_id: parentId,
          content: `Level ${i} comment`,
          user_id: "user1",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          upvotes_count: 0,
          flags_count: 0,
          depth: i
        });
        parentId = commentId;
      }
      
      const tree = threadService.buildCommentTree(mockComments);
      
      // Should have 1 root comment
      expect(tree.length).toBe(1);
      
      // Navigate down the tree to verify all 10 levels
      let current = tree[0];
      for (let i = 1; i < 10; i++) {
        expect(current.replies!.length).toBe(1);
        current = current.replies![0];
        expect(current.content).toBe(`Level ${i} comment`);
      }
    });
  });
  
  // Upvoting tests
  describe("Thread Upvoting", () => {
    it("should toggle upvote on thread", async () => {
      const result = await threadService.toggleUpvote({ threadId: testThreadId });
      expect(result).toBe(true); // Upvote added
    });
    
    it("should toggle upvote on comment", async () => {
      const commentId = "test-comment-id";
      const result = await threadService.toggleUpvote({ commentId });
      expect(result).toBe(true); // Upvote added
    });
  });
  
  // Content flagging tests
  describe("Content Flagging", () => {
    it("should flag a thread for moderation", async () => {
      const flag = await threadService.flagContent({
        threadId: testThreadId,
        reason: "Inappropriate content"
      });
      
      expect(flag).toBeTruthy();
    });
    
    it("should flag a comment for moderation", async () => {
      const flag = await threadService.flagContent({
        commentId: "test-comment-id",
        reason: "Spam"
      });
      
      expect(flag).toBeTruthy();
    });
  });
  
  // Thread subscription tests
  describe("Thread Subscriptions", () => {
    it("should toggle thread subscription", async () => {
      const isSubscribed = await threadService.toggleSubscription(testThreadId);
      expect(isSubscribed).toBe(true); // Subscribed
    });
    
    it("should check subscription status", async () => {
      const notSubscribed = await threadService.isSubscribed(testThreadId);
      expect(notSubscribed).toBe(false);
    });
  });
});
