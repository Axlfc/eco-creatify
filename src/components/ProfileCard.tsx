import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

export const ProfileCard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        console.log("Fetching profile for user:", session.user.id);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        console.log("Profile data:", data);
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) return null;

  return (
    <Card className="bg-secondary/5 border-0">
      <CardHeader className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar_url || undefined} />
            <AvatarFallback>
              {profile.username?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {profile.username || "Anonymous"}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant="secondary">{profile.rank}</Badge>
              {profile.is_verified && (
                <Badge variant="default">Verified</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Reputation</p>
            <p className="font-medium">{profile.reputation || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Posts</p>
            <p className="font-medium">{profile.post_count || 0}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Joined</p>
            <p className="font-medium">
              {profile.join_date
                ? new Date(profile.join_date).toLocaleDateString()
                : "Recently"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Active</p>
            <p className="font-medium">
              {profile.last_active
                ? new Date(profile.last_active).toLocaleDateString()
                : "Recently"}
            </p>
          </div>
        </div>
        {profile.bio && (
          <div>
            <p className="text-sm text-muted-foreground">Bio</p>
            <p className="mt-1">{profile.bio}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};