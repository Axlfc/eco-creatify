
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type Post = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  is_visible: boolean;
  likes_count: number;
  user_id: string;
};

type PostListProps = {
  posts: Post[];
  isCurrentUser: boolean;
  isAuthenticated: boolean;
};

export const PostList = ({ posts, isCurrentUser, isAuthenticated }: PostListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [localLikeCounts, setLocalLikeCounts] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    // Initialize local like counts from posts
    const initialCounts: { [key: string]: number } = {};
    posts.forEach(post => {
      initialCounts[post.id] = post.likes_count;
    });
    setLocalLikeCounts(initialCounts);
  }, [posts]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);

      if (session?.user?.id) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', session.user.id);
        
        if (likes) {
          setLikedPosts(new Set(likes.map(like => like.post_id)));
        }
      }
    };
    checkUser();
  }, []);

  // Set up real-time subscription for post likes
  useEffect(() => {
    const channel = supabase
      .channel('post-likes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_likes'
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const postId = payload.new.post_id;
            setLocalLikeCounts(prev => ({
              ...prev,
              [postId]: (prev[postId] || 0) + 1
            }));
          } else if (payload.eventType === 'DELETE') {
            const postId = payload.old.post_id;
            setLocalLikeCounts(prev => ({
              ...prev,
              [postId]: Math.max((prev[postId] || 0) - 1, 0)
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!currentUserId) throw new Error("Must be logged in to like posts");
      
      const post = posts.find(p => p.id === postId);
      if (!post) throw new Error("Post not found");
      
      if (!post.is_visible) {
        throw new Error("Cannot like hidden posts");
      }

      if (post.user_id === currentUserId) {
        throw new Error("You cannot like your own posts");
      }

      try {
        if (likedPosts.has(postId)) {
          // Unlike the post
          const { error: unlikeError } = await supabase
            .from('post_likes')
            .delete()
            .eq('post_id', postId)
            .eq('user_id', currentUserId);

          if (unlikeError) throw unlikeError;
          
          setLikedPosts(prev => {
            const next = new Set(prev);
            next.delete(postId);
            return next;
          });

          // Update local count immediately
          setLocalLikeCounts(prev => ({
            ...prev,
            [postId]: Math.max((prev[postId] || 0) - 1, 0)
          }));
        } else {
          // Check if like already exists first
          const { data: existingLike, error: checkError } = await supabase
            .from('post_likes')
            .select('*')
            .eq('post_id', postId)
            .eq('user_id', currentUserId)
            .maybeSingle();

          if (checkError) throw checkError;

          // Only insert if no existing like
          if (!existingLike) {
            const { error: insertError } = await supabase
              .from('post_likes')
              .insert([
                { post_id: postId, user_id: currentUserId }
              ]);

            if (insertError) throw insertError;
            
            setLikedPosts(prev => new Set([...prev, postId]));

            // Update local count immediately
            setLocalLikeCounts(prev => ({
              ...prev,
              [postId]: (prev[postId] || 0) + 1
            }));
          }
        }

        // Refresh the posts data
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      } catch (error) {
        console.error("Error handling like operation:", error);
        throw error;
      }
    },
    onError: (error: Error) => {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to like post. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Get only visible posts for non-authenticated users
  const visiblePosts = posts.filter(post => post.is_visible === true);

  // For non-authenticated users with no visible posts, show sign up prompt
  if (!isAuthenticated && visiblePosts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">Sign up to create your own posts!</p>
        <Button onClick={() => navigate("/auth")}>Sign Up</Button>
      </div>
    );
  }

  // For authenticated users with no posts
  if (isAuthenticated && posts.length === 0) {
    if (isCurrentUser) {
      return <p className="text-center text-muted-foreground">You haven't created any posts yet</p>;
    }
    return <p className="text-center text-muted-foreground">No posts yet</p>;
  }

  // Show appropriate posts based on authentication status
  const displayPosts = isAuthenticated ? posts : visiblePosts;

  return (
    <div className="space-y-4">
      {displayPosts.map((post) => (
        <Card key={post.id} className={!post.is_visible ? "opacity-50" : ""}>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            {post.is_visible ? (
              <p className="text-muted-foreground">{post.description}</p>
            ) : (
              <p className="text-muted-foreground italic">This post is hidden</p>
            )}
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => currentUserId ? likePost.mutate(post.id) : navigate("/auth")}
                disabled={post.user_id === currentUserId || !post.is_visible}
                className={likedPosts.has(post.id) ? "text-primary" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                {localLikeCounts[post.id] || 0}
              </Button>
              <span>Posted on {new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
