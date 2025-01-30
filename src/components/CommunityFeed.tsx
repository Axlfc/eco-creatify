import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MessageCircle, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type Post = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  likes_count: number;
  created_at: string;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
};

export const CommunityFeed = () => {
  const { toast } = useToast();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);
    };
    checkUser();
  }, []);

  const { data: posts, isLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      console.log("Fetching posts...");
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles(username, avatar_url)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
        throw error;
      }

      console.log("Posts fetched:", data);
      return data as Post[];
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

  if (isLoading) {
    return <div className="text-center">Loading posts...</div>;
  }

  return (
    <div className="space-y-6">
      {posts?.map((post) => (
        <Card key={post.id} className="animate-fade-up">
          <CardHeader>
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
          </CardHeader>
          <CardContent>
            <h3 className="font-semibold mb-2">{post.title}</h3>
            {post.description && <p className="text-muted-foreground">{post.description}</p>}
            {post.image_url && (
              <img 
                src={post.image_url} 
                alt={post.title}
                className="mt-4 rounded-lg w-full object-cover max-h-96"
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-2" />
              Comment
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleShare(post)}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};