
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

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
};

export const PostList = ({ posts }: PostListProps) => {
  if (posts.length === 0) {
    return <p className="text-center text-muted-foreground">No posts yet</p>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id} className={post.is_visible ? "" : "opacity-50"}>
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
