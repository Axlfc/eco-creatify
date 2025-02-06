import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

type Post = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  is_visible: boolean;
};

const UserProfile = () => {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .single();

        if (profileError || !profileData) {
          toast({
            title: "Error",
            description: "User profile not found",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setProfile(profileData);

        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", profileData.id)
          .order("created_at", { ascending: false });

        if (postsError) throw postsError;
        setPosts(postsData || []);
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username, navigate, toast]);

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-12 w-[250px] mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-xl">
              {profile?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl">{profile?.username}</h1>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">
                  Joined {new Date(profile?.join_date).toLocaleDateString()}
                </Badge>
                {profile?.is_verified && (
                  <Badge>Verified</Badge>
                )}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

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
              <p className="text-sm text-muted-foreground mt-4">
                Posted on {new Date(post.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-muted-foreground">No posts yet</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;