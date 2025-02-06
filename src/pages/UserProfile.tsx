import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Heart, UserPlus, UserMinus } from "lucide-react";

type Post = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  is_visible: boolean;
  likes_count: number;
};

const UserProfile = () => {
  const { username } = useParams();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUserId(session?.user?.id || null);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for username:", username);
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw profileError;
        }

        if (!profileData) {
          console.log("No profile found for username:", username);
          toast({
            title: "Profile not found",
            description: "The requested profile does not exist",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        console.log("Profile found:", profileData);
        setProfile(profileData);

        // Check if current user is following this profile
        if (currentUserId && profileData.id !== currentUserId) {
          const { data: followData } = await supabase
            .from("followers")
            .select("*")
            .eq("follower_id", currentUserId)
            .eq("following_id", profileData.id)
            .maybeSingle();
          
          setIsFollowing(!!followData);
        }

        const { data: postsData, error: postsError } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", profileData.id)
          .order("created_at", { ascending: false });

        if (postsError) {
          console.error("Error fetching posts:", postsError);
          throw postsError;
        }

        console.log("Posts fetched:", postsData);
        setPosts(postsData || []);
      } catch (error: any) {
        console.error("Error in fetchProfile:", error);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (currentUserId) {
      fetchProfile();
    }
  }, [username, navigate, toast, currentUserId]);

  const handleFollowToggle = async () => {
    if (!currentUserId || !profile) return;

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from("followers")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("following_id", profile.id);

        if (error) throw error;
        setIsFollowing(false);
        toast({
          title: "Unfollowed",
          description: `You are no longer following ${profile.username}`,
        });
      } else {
        // Follow
        const { error } = await supabase
          .from("followers")
          .insert({
            follower_id: currentUserId,
            following_id: profile.id,
          });

        if (error) throw error;
        setIsFollowing(true);
        toast({
          title: "Following",
          description: `You are now following ${profile.username}`,
        });
      }
    } catch (error: any) {
      console.error("Error toggling follow:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto py-8 px-4">
          <Skeleton className="h-12 w-[250px] mb-6" />
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-4">
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
              </div>
              {currentUserId && currentUserId !== profile?.id && (
                <Button
                  onClick={handleFollowToggle}
                  variant={isFollowing ? "outline" : "default"}
                  className="ml-4"
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="w-4 h-4 mr-2" />
                      Unfollow
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
              )}
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
          {posts.length === 0 && (
            <p className="text-center text-muted-foreground">No posts yet</p>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfile;