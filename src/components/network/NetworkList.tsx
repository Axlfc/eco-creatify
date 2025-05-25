import React from "react";
import NetworkProfileCard from "./NetworkProfileCard";
import { ForumUserProfile } from "@/types/forum";

/**
 * Listado de perfiles para networking.
 * Muestra reputación y permite conectar.
 * TODO: Integrar con API real y sistema de reputación.
 */
const mockProfiles: ForumUserProfile[] = [
  { username: "mockUser", displayName: "Mock User", reputation: 0 },
  { username: "ayudante", displayName: "Ayudante", reputation: 10 },
];

const NetworkList: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {mockProfiles.map(profile => (
        <NetworkProfileCard key={profile.username} profile={profile} />
      ))}
    </div>
  );
};

export default NetworkList;
