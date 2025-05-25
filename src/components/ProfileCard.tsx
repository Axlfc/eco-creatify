/**
 * LEGACY - Componente de perfil de usuario.
 *
 * TODO: Revisar duplicidades con nuevos módulos de perfil/red profesional.
 * TODO: Refactorizar para centralizar lógica y tipos de usuario/perfil.
 * TODO: Preparar integración con sistema de reputación y networking.
 */

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;

export const ProfileCard = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        setNewUsername(data.username || "");
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleUsernameUpdate = async () => {
    if (!profile) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username: newUsername })
        .eq("id", profile.id);

      if (error) {
        throw error;
      }

      setProfile({ ...profile, username: newUsername });
      setIsEditingUsername(false);
      toast({
        title: "Username updated",
        description: "Your username has been successfully updated.",
      });
    } catch (error: any) {
      console.error("Error updating username:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update username. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getNextUsernameChangeDate = () => {
    if (!profile?.last_username_change) return null;
    const lastChange = new Date(profile.last_username_change);
    const nextChange = new Date(lastChange.getTime() + (90 * 24 * 60 * 60 * 1000));
    return nextChange;
  };

  if (!profile) return null;

  const nextChangeDate = getNextUsernameChangeDate();
  const canChangeUsername = !nextChangeDate || new Date() >= nextChangeDate;

  return (
    <Card className="bg-secondary/5 border-0">
      <CardHeader className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {isEditingUsername ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="Enter new username"
                    className="max-w-[200px]"
                  />
                  <Button 
                    onClick={handleUsernameUpdate}
                    disabled={isLoading || !newUsername || newUsername === profile.username}
                    size="sm"
                  >
                    Save
                  </Button>
                  <Button 
                    onClick={() => {
                      setIsEditingUsername(false);
                      setNewUsername(profile.username || "");
                    }}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <CardTitle className="text-2xl">
                    {profile.username || "Anonymous"}
                  </CardTitle>
                  {canChangeUsername && (
                    <Button
                      onClick={() => setIsEditingUsername(true)}
                      variant="ghost"
                      size="sm"
                    >
                      Edit
                    </Button>
                  )}
                </>
              )}
            </div>
            {!canChangeUsername && nextChangeDate && (
              <p className="text-sm text-muted-foreground mt-1">
                Username can be changed after {nextChangeDate.toLocaleDateString()}
              </p>
            )}
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