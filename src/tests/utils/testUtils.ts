
import { supabase } from "@/integrations/supabase/client";
import { ThreadFormData, ThreadCommentFormData } from "@/types/thread";

/**
 * Test utilities for thread system tests
 */
export const testUtils = {
  /**
   * Clean up test data
   */
  async cleanupTestThreads(prefix: string): Promise<void> {
    // Delete threads with test prefix
    const { error } = await supabase
      .from('threads')
      .delete()
      .like('title', `${prefix}%`);
      
    if (error) {
      console.error("Error cleaning up test threads:", error);
    }
  },
  
  /**
   * Create a test thread
   */
  async createTestThread(testUserId: string, prefix: string = "TEST_"): Promise<string> {
    const testThreadData: Partial<ThreadFormData> & { user_id: string } = {
      title: `${prefix}Thread ${Date.now()}`,
      content: "This is a test thread created for automated testing.",
      category: "test-category",
      tags: ["test", "automated"],
      user_id: testUserId
    };
    
    const { data, error } = await supabase
      .from('threads')
      .insert(testThreadData)
      .select('id')
      .single();
      
    if (error) {
      throw new Error(`Failed to create test thread: ${error.message}`);
    }
    
    return data.id;
  },
  
  /**
   * Create test user session for testing
   */
  async createTestUserSession(): Promise<string> {
    // This would typically be replaced with an actual test user in a real implementation
    // For now, we just generate a random ID for testing purposes
    return `test-user-${Date.now()}`;
  },
  
  /**
   * Create multiple nested comments for testing
   */
  async createNestedComments(threadId: string, userId: string, depth: number = 5): Promise<string[]> {
    const commentIds: string[] = [];
    let parentId: string | null = null;
    
    // Create a chain of nested comments up to the specified depth
    for (let i = 0; i < depth; i++) {
      const commentData = {
        thread_id: threadId,
        parent_id: parentId,
        content: `Test nested comment level ${i + 1}`,
        user_id: userId
      };
      
      const { data, error } = await supabase
        .from('thread_comments')
        .insert(commentData)
        .select('id')
        .single();
        
      if (error) {
        throw new Error(`Failed to create test comment: ${error.message}`);
      }
      
      commentIds.push(data.id);
      parentId = data.id; // Each comment becomes parent of the next one
    }
    
    return commentIds;
  }
};
