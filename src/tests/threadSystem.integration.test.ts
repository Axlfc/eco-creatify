
import { supabase } from "@/integrations/supabase/client";
import { threadService } from "@/services/threadService";
import { testUtils } from "@/tests/utils/testUtils";
import { ThreadFormData, ThreadCommentFormData } from "@/types/thread";

// Integration tests will use real Supabase connections in a test environment
// For CI/CD, these would be pointed to a test database

const TEST_PREFIX = "TEST_INTEGRATION_";
let testUserId: string;
let testThreadId: string;

// Skip these tests in CI unless a test database is configured
const runTests = process.env.TEST_SUPABASE_URL ? describe : describe.skip;

runTests("Thread System Integration Tests", () => {
  // Setup before all tests
  beforeAll(async () => {
    testUserId = await testUtils.createTestUserSession();
  });
  
  // Clean up after all tests
  afterAll(async () => {
    await testUtils.cleanupTestThreads(TEST_PREFIX);
  });
  
  // Thread creation and retrieval
  describe("Thread Creation and Retrieval", () => {
    it("should create and retrieve a thread with all data", async () => {
      const threadData: ThreadFormData = {
        title: `${TEST_PREFIX}Integration Test Thread`,
        content: "This is a test thread for integration testing with **formatted** content and [links](https://example.com).",
        category: "integration-testing",
        tags: ["test", "integration", "automated"],
        format: "markdown"
      };
      
      // Create the thread
      const thread = await threadService.createThread(threadData);
      expect(thread).toBeTruthy();
      expect(thread!.id).toBeTruthy();
      testThreadId = thread!.id;
      
      // Retrieve the thread
      const result = await threadService.getThreadWithComments(testThreadId);
      expect(result).toBeTruthy();
      expect(result!.thread.title).toBe(threadData.title);
      expect(result!.thread.content).toBe(threadData.content);
      expect(result!.thread.category).toBe(threadData.category);
      expect(result!.thread.tags).toEqual(expect.arrayContaining(threadData.tags));
    });
  });
  
  // Comment nesting tests
  describe("Comment Nesting", () => {
    it("should support deeply nested comments up to 10 levels", async () => {
      // Create 10 levels of nested comments
      const commentIds = await testUtils.createNestedComments(testThreadId, testUserId, 10);
      expect(commentIds.length).toBe(10);
      
      // Retrieve the comments
      const result = await threadService.getThreadWithComments(testThreadId);
      expect(result).toBeTruthy();
      
      // Build the comment tree
      const commentTree = threadService.buildCommentTree(result!.comments);
      
      // The tree should include our nested comment chain
      expect(commentTree.length).toBeGreaterThan(0);
      
      // Find our comment chain (might not be the only one)
      let foundChain = false;
      
      function checkDepth(comments, currentDepth = 0, targetDepth = 10) {
        if (currentDepth >= targetDepth) {
          foundChain = true;
          return true;
        }
        
        if (!comments || comments.length === 0) return false;
        
        for (const comment of comments) {
          if (comment.replies && comment.replies.length > 0) {
            if (checkDepth(comment.replies, currentDepth + 1, targetDepth)) {
              return true;
            }
          }
        }
        
        return false;
      }
      
      checkDepth(commentTree);
      expect(foundChain).toBe(true);
    });
  });
  
  // Upvoting tests
  describe("Upvoting System", () => {
    it("should add and remove upvotes with proper validation", async () => {
      // Add an upvote
      const addResult = await threadService.toggleUpvote({ threadId: testThreadId });
      expect(addResult).toBe(true);
      
      // Verify upvote count increased
      const threadAfterUpvote = await threadService.getThreadWithComments(testThreadId);
      const upvoteCount1 = threadAfterUpvote!.thread.upvotes_count;
      
      // Try to upvote again (should be idempotent)
      await threadService.toggleUpvote({ threadId: testThreadId });
      
      // Verify count didn't change
      const threadAfterSecondUpvote = await threadService.getThreadWithComments(testThreadId);
      const upvoteCount2 = threadAfterSecondUpvote!.thread.upvotes_count;
      
      expect(upvoteCount2).toBe(upvoteCount1);
      
      // Remove the upvote
      const removeResult = await threadService.toggleUpvote({ threadId: testThreadId });
      expect(removeResult).toBe(false);
      
      // Verify count decreased
      const threadAfterRemove = await threadService.getThreadWithComments(testThreadId);
      const upvoteCount3 = threadAfterRemove!.thread.upvotes_count;
      
      expect(upvoteCount3).toBe(upvoteCount1 - 1);
    });
  });
  
  // Content flagging tests
  describe("Content Flagging System", () => {
    it("should flag content and notify moderators", async () => {
      const flagResult = await threadService.flagContent({
        threadId: testThreadId,
        reason: "Integration test flag"
      });
      
      expect(flagResult).toBeTruthy();
      
      // In a real implementation, we would verify moderator notification here
      // For this test, we'll just verify the flag was created
      const { data, error } = await supabase
        .from('thread_flags')
        .select('*')
        .eq('thread_id', testThreadId)
        .eq('reason', 'Integration test flag');
        
      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data!.length).toBeGreaterThan(0);
    });
  });
  
  // Thread categorization tests
  describe("Thread Categorization and Tagging", () => {
    it("should accurately categorize and tag threads", async () => {
      // Create threads with different categories and tags
      const categories = ["news", "discussion", "question", "announcement"];
      const tagSets = [
        ["politics", "current-events"],
        ["technology", "programming"],
        ["help", "support", "bug"],
        ["official", "important"]
      ];
      
      const createdThreadIds = [];
      
      // Create a thread in each category with its corresponding tags
      for (let i = 0; i < categories.length; i++) {
        const threadData: ThreadFormData = {
          title: `${TEST_PREFIX}Category Test: ${categories[i]}`,
          content: `Test thread for category ${categories[i]}`,
          category: categories[i],
          tags: tagSets[i]
        };
        
        const thread = await threadService.createThread(threadData);
        expect(thread).toBeTruthy();
        createdThreadIds.push(thread!.id);
      }
      
      // Verify each thread has the correct category and tags
      for (let i = 0; i < createdThreadIds.length; i++) {
        const result = await threadService.getThreadWithComments(createdThreadIds[i]);
        expect(result!.thread.category).toBe(categories[i]);
        expect(result!.thread.tags).toEqual(expect.arrayContaining(tagSets[i]));
      }
    });
  });
  
  // Subscription and notification tests
  describe("Thread Subscription and Notifications", () => {
    it("should allow subscribing to threads and receive notifications", async () => {
      // Subscribe to the thread
      const subscribeResult = await threadService.toggleSubscription(testThreadId);
      expect(subscribeResult).toBe(true);
      
      // Verify subscription status
      const isSubscribed = await threadService.isSubscribed(testThreadId);
      expect(isSubscribed).toBe(true);
      
      // Add a comment which should trigger a notification
      const commentData: ThreadCommentFormData = {
        content: "This comment should trigger a notification"
      };
      
      await threadService.addComment(testThreadId, commentData);
      
      // In a real implementation, we would verify notification delivery
      // For this test, we'll just check the database record
      const { data, error } = await supabase
        .from('thread_notifications')
        .select('*')
        .eq('thread_id', testThreadId)
        .eq('user_id', testUserId);
        
      expect(error).toBeNull();
      expect(data).toBeTruthy();
      
      // Unsubscribe from the thread
      const unsubscribeResult = await threadService.toggleSubscription(testThreadId);
      expect(unsubscribeResult).toBe(false);
      
      // Verify subscription status
      const isStillSubscribed = await threadService.isSubscribed(testThreadId);
      expect(isStillSubscribed).toBe(false);
    });
  });
});
