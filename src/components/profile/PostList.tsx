
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  // Initialize local like counts from posts prop
  useEffect(() => {
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

  // Calculate pagination values
  const totalPosts = isAuthenticated ? posts.length : visiblePosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  
  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = isAuthenticated 
    ? posts.slice(indexOfFirstPost, indexOfLastPost) 
    : visiblePosts.slice(indexOfFirstPost, indexOfLastPost);
  
  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

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

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="icon"
          onClick={() => goToPage(i)}
          className="w-8 h-8"
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="space-y-4">
      {currentPosts.map((post) => (
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
                {localLikeCounts[post.id] ?? post.likes_count}
              </Button>
              <span>Posted on {new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToPreviousPage} 
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {renderPageNumbers()}
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={goToNextPage} 
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
          <span>
            Showing {indexOfFirstPost + 1}-{Math.min(indexOfLastPost, totalPosts)} of {totalPosts} posts
          </span>
          <span>
            Page {currentPage} of {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};
