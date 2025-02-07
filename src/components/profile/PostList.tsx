
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Post = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  is_visible: boolean;
  likes_count: number;
};

type PostListProps = {
  posts: Post[];
  isCurrentUser: boolean;
  isAuthenticated: boolean;
};

export const PostList = ({ posts, isCurrentUser, isAuthenticated }: PostListProps) => {
  const navigate = useNavigate();
  
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
            <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-1" />
                {post.likes_count || 0} likes
              </div>
              <span>•</span>
              <span>Posted on {new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
