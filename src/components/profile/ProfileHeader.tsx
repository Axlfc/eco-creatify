
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus, UserMinus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ProfileHeaderProps = {
  profile: {
    id: string;
    username: string;
    join_date: string;
    is_verified: boolean;
    rank?: string;
    expertise?: string[];
  };
  currentUserId: string | null;
  isFollowing: boolean;
  onFollowToggle: () => Promise<void>;
};

export const ProfileHeader = ({ profile, currentUserId, isFollowing, onFollowToggle }: ProfileHeaderProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-xl">
              {profile?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl">{profile?.username}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">
                  Joined {new Date(profile?.join_date).toLocaleDateString()}
                </Badge>
                {profile?.is_verified && (
                  <Badge>Verified</Badge>
                )}
                {profile?.rank && (
                  <Badge variant="outline">{profile.rank}</Badge>
                )}
                {profile?.expertise && profile.expertise.map((area, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          {currentUserId && currentUserId !== profile?.id && (
            <Button
              onClick={onFollowToggle}
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
  );
};
