import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageCircle, Share2, Heart, Send, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Post = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  likes_count: number;
  created_at: string;
  user_id: string;
  is_visible?: boolean;
  view_count?: number;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  post_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
};

export const CommunityFeed = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ title: "", description: "" });
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [showComments, setShowComments] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);
    };
    checkUser();
  }, []);

  // Query posts with visibility and view count
  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      console.log("Fetching posts...");
      const { data, error } = await supabase
        .from('posts')
        .select('*, profiles!posts_user_id_fkey_profiles(username, avatar_url)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      console.log("Posts fetched:", data);
      return data as Post[];
    },
  });

  // Query comments
  const { data: allComments } = useQuery({
    queryKey: ['comments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles!comments_user_id_fkey_profiles(username, avatar_url)')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Comment[];
    },
  });

  // Toggle post visibility mutation
  const toggleVisibility = useMutation({
    mutationFn: async (postId: string) => {
      if (!currentUserId) throw new Error("Must be logged in to update posts");
      
      const post = posts?.find(p => p.id === postId);
      const newVisibility = !post?.is_visible;
      
      const { data, error } = await supabase
        .from('posts')
        .update({ is_visible: newVisibility })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Post visibility updated",
        description: "Your post visibility has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating post visibility:", error);
      toast({
        title: "Error",
        description: "Failed to update post visibility. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createPost = useMutation({
    mutationFn: async ({ title, description }: { title: string, description: string }) => {
      if (!currentUserId) throw new Error("Must be logged in to post");

      const { data, error } = await supabase
        .from('posts')
        .insert([
          { title, description, user_id: currentUserId }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setNewPost({ title: "", description: "" });
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
      });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create comment mutation
  const createComment = useMutation({
    mutationFn: async ({ postId, content }: { postId: string, content: string }) => {
      if (!currentUserId) throw new Error("Must be logged in to comment");
      
      const { data, error } = await supabase
        .from('comments')
        .insert([
          { post_id: postId, content, user_id: currentUserId }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      setNewComment({ ...newComment, [variables.postId]: "" });
      toast({
        title: "Comment added",
        description: "Your comment has been posted successfully.",
      });
    },
    onError: (error) => {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Like post mutation
  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!currentUserId) throw new Error("Must be logged in to like posts");
      
      const { data, error } = await supabase
        .from('posts')
        .update({ likes_count: posts?.find(p => p.id === postId)?.likes_count! + 1 })
        .eq('id', postId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error) => {
      console.error("Error liking post:", error);
      toast({
        title: "Error",
        description: "Failed to like post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleShare = async (post: Post) => {
    try {
      await navigator.share({
        title: post.title,
        text: post.description || '',
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support sharing.",
        variant: "destructive",
      });
    }
  };

  const getCommentsForPost = (postId: string) => {
    return allComments?.filter(comment => comment.post_id === postId) || [];
  };

  if (isLoading) {
    return <div className="text-center">Loading posts...</div>;
  }

  return (
    <div className="space-y-6">
      {currentUserId && (
        <Card className="animate-fade-up">
          <CardHeader>
            <CardTitle className="text-lg">Create a Post</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Enter your post title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newPost.description}
                onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
                placeholder="What's on your mind?"
              />
            </div>
            <Button 
              onClick={() => createPost.mutate(newPost)}
              disabled={!newPost.title || createPost.isPending}
              className="w-full"
            >
              Post
            </Button>
          </CardContent>
        </Card>
      )}

      {posts?.map((post) => {
        const comments = getCommentsForPost(post.id);
        const isOwnPost = post.user_id === currentUserId;
        
        return (
          <Card key={post.id} className="animate-fade-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    {post.profiles?.username?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{post.profiles?.username || 'Anonymous'}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {isOwnPost && (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`visibility-${post.id}`} className="text-sm">
                      {post.is_visible ? 'Visible' : 'Hidden'}
                    </Label>
                    <Switch
                      id={`visibility-${post.id}`}
                      checked={post.is_visible}
                      onCheckedChange={() => toggleVisibility.mutate(post.id)}
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold mb-2">{post.title}</h3>
              {post.description && <p className="text-muted-foreground">{post.description}</p>}
              <div className="flex items-center space-x-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {post.view_count || 0} views
                </div>
                <div className="flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {comments.length} comments
                </div>
                <div className="flex items-center">
                  <Heart className="h-4 w-4 mr-1" />
                  {post.likes_count || 0} likes
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="flex justify-between w-full">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowComments({ ...showComments, [post.id]: !showComments[post.id] })}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Comments
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => currentUserId ? likePost.mutate(post.id) : toast({
                    title: "Login required",
                    description: "Please login to like posts",
                    variant: "destructive",
                  })}
                >
                  <Heart className={`h-4 w-4 mr-2 ${post.likes_count > 0 ? 'fill-current' : ''}`} />
                  {post.likes_count || 0}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleShare(post)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>

              {showComments[post.id] && (
                <div className="w-full space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-3 p-3 bg-accent/5 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm">
                        {comment.profiles?.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{comment.profiles?.username || 'Anonymous'}</p>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}

                  {currentUserId && (
                    <div className="flex space-x-2">
                      <Input
                        value={newComment[post.id] || ''}
                        onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                        placeholder="Write a comment..."
                      />
                      <Button 
                        size="icon"
                        onClick={() => createComment.mutate({ 
                          postId: post.id, 
                          content: newComment[post.id] || '' 
                        })}
                        disabled={!newComment[post.id]}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};
