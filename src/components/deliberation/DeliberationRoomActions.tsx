import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, UserPlus, Clock, CheckCircle } from "lucide-react";

interface DeliberationRoom {
  id: string;
  title: string;
  status: "open" | "active" | "completed";
}

interface DeliberationRoomActionsProps {
  room: DeliberationRoom;
  canJoin: boolean;
  isFullyBooked: boolean;
  isAuthenticated: boolean;
  onJoinRoom: (roomId: string, roomTitle: string) => void;
  onViewRoom: (roomId: string, roomTitle: string) => void;
}

const DeliberationRoomActions: React.FC<DeliberationRoomActionsProps> = ({
  room,
  canJoin,
  isFullyBooked,
  isAuthenticated,
  onJoinRoom,
  onViewRoom
}) => {
  return (
    <div className="flex gap-2 ml-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onViewRoom(room.id, room.title)}
      >
        <Eye className="h-4 w-4 mr-1" />
        View
      </Button>
      
      {canJoin && !isFullyBooked && (
        <Button
          size="sm"
          onClick={() => onJoinRoom(room.id, room.title)}
          disabled={!isAuthenticated}
          title={!isAuthenticated ? "Inicia sesión para unirte" : "Unirse a la sala"}
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Join
        </Button>
      )}
      
      {isFullyBooked && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onJoinRoom(room.id, room.title)}
          disabled={!isAuthenticated}
          title={!isAuthenticated ? "Inicia sesión para la lista de espera" : "Unirse a lista de espera"}
        >
          <Clock className="h-4 w-4 mr-1" />
          Waitlist
        </Button>
      )}
      
      {room.status === 'completed' && (
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewRoom(room.id, room.title)}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Results
        </Button>
      )}
    </div>
  );
};

export default DeliberationRoomActions;