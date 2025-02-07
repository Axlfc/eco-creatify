
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PostList } from "@/components/profile/PostList";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session) {
        setCurrentUserId(session.user.id);
      }
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

        // Fetch all posts for this profile
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

    fetchProfile();
  }, [username, navigate, toast, currentUserId]);

  const handleFollowToggle = async () => {
    if (!currentUserId || !profile) {
      // If not logged in, redirect to auth
      if (!currentUserId) {
        toast({
          title: "Authentication required",
          description: "Please log in to follow users",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      return;
    }

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
        <ProfileHeader
          profile={profile}
          currentUserId={currentUserId}
          isFollowing={isFollowing}
          onFollowToggle={handleFollowToggle}
        />
        <PostList 
          posts={posts} 
          isCurrentUser={currentUserId === profile?.id}
          isAuthenticated={isAuthenticated}
        />
      </div>
    </>
  );
};

export default UserProfile;
