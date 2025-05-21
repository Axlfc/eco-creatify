
import { supabase } from "@/integrations/supabase/client";
import { ThreadFormData } from "@/types/thread";

export const testUtils = {
  /**
   * Create a test user session (or get existing)
   */
  async createTestUserSession(): Promise<string> {
    // For testing, we'll use a fixed ID
    return "test-user-id";
  },
  
  /**
   * Clean up test threads
   */
  async cleanupTestThreads(prefix: string): Promise<void> {
    // In a real environment, this would delete test threads
    if (process.env.NODE_ENV === 'test') {
      console.log(`Mock: Cleaning up test threads with prefix ${prefix}`);
      return;
    }
    
    // In the real implementation, we would do this:
    try {
      const { data: threads, error } = await supabase
        .from('threads')
        .select('id')
        .like('title', `${prefix}%`);
        
      if (error) {
        console.error("Error finding test threads:", error);
        return;
      }
      
      if (!threads || threads.length === 0) {
        return;
      }
      
      const threadIds = threads.map(t => t.id);
      
      // Delete the threads (cascading deletes will handle comments, etc.)
      const { error: deleteError } = await supabase
        .from('threads')
        .delete()
        .in('id', threadIds);
        
      if (deleteError) {
        console.error("Error cleaning up test threads:", deleteError);
      }
    } catch (err) {
      console.error("Error in cleanupTestThreads:", err);
    }
  },
  
  /**
   * Create a chain of nested comments for testing
   */
  async createNestedComments(
    threadId: string, 
    userId: string, 
    depth: number
  ): Promise<string[]> {
    // For testing, we'll return mock IDs
    if (process.env.NODE_ENV === 'test' || !threadId) {
      return Array(depth).fill(0).map((_, i) => `test-comment-id-${i}`);
    }
    
    const commentIds: string[] = [];
    let parentId: string | null = null;
    
    // Create comments in sequence, each replying to the previous
    for (let i = 0; i < depth; i++) {
      try {
        const { data, error } = await supabase
          .from('thread_comments')
          .insert({
            thread_id: threadId,
            parent_id: parentId,
            content: `Test nested comment at level ${i}`,
            user_id: userId
          })
          .select()
          .single();
          
        if (error) {
          console.error(`Error creating comment at depth ${i}:`, error);
          break;
        }
        
        if (data) {
          commentIds.push(data.id);
          parentId = data.id;
        }
      } catch (err) {
        console.error(`Error in createNestedComments at depth ${i}:`, err);
        break;
      }
    }
    
    return commentIds;
  }
};
