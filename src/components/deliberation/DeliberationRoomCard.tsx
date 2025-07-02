import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, AlertTriangle } from "lucide-react";
import DeliberationRoomActions from "./DeliberationRoomActions";

interface DeliberationRoom {
  id: string;
  title: string;
  description: string;
  status: "open" | "active" | "completed";
  participants: number;
  maxParticipants: number;
  createdBy: string;
  deadline: string;
  category: string;
  phase: string;
  consensusLevel: number;
}

interface DeliberationRoomCardProps {
  room: DeliberationRoom;
  isAuthenticated: boolean;
  onJoinRoom: (roomId: string, roomTitle: string) => void;
  onViewRoom: (roomId: string, roomTitle: string) => void;
}

const statusConfig = {
  "open": { 
    color: "text-blue-600", 
    bg: "bg-blue-50", 
    label: "Open for Participation",
    border: "border-blue-200"
  },
  "active": { 
    color: "text-green-600", 
    bg: "bg-green-50", 
    label: "Active Discussion",
    border: "border-green-200"
  },
  "completed": { 
    color: "text-gray-600", 
    bg: "bg-gray-50", 
    label: "Completed",
    border: "border-gray-200"
  }
};

const getConsensusColor = (level: number) => {
  if (level >= 80) return "text-green-600 bg-green-50";
  if (level >= 60) return "text-blue-600 bg-blue-50";
  if (level >= 40) return "text-amber-600 bg-amber-50";
  return "text-red-600 bg-red-50";
};

const DeliberationRoomCard: React.FC<DeliberationRoomCardProps> = ({
  room,
  isAuthenticated,
  onJoinRoom,
  onViewRoom
}) => {
  const config = statusConfig[room.status];
  const canJoin = room.status !== 'completed' && room.participants < room.maxParticipants;
  const isFullyBooked = room.participants >= room.maxParticipants && room.status !== 'completed';

  return (
    <Card className={`${config.border} hover:shadow-md transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">{room.category}</Badge>
              <Badge className={`${config.bg} ${config.color} border-0`}>
                {config.label}
              </Badge>
              <Badge variant="outline">
                Phase: {room.phase}
              </Badge>
              {room.status !== 'completed' && (
                <Badge className={getConsensusColor(room.consensusLevel)}>
                  {room.consensusLevel}% consensus
                </Badge>
              )}
            </div>
            <h3 className="font-medium text-lg mb-2">{room.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{room.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {room.participants}/{room.maxParticipants} participants
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Deadline: {new Date(room.deadline).toLocaleDateString()}
              </span>
              <span>Por: {room.createdBy}</span>
            </div>
            
            {isFullyBooked && (
              <div className="mt-2 flex items-center gap-1 text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Sala llena - Lista de espera disponible</span>
              </div>
            )}
          </div>
          
          <DeliberationRoomActions
            room={room}
            canJoin={canJoin}
            isFullyBooked={isFullyBooked}
            isAuthenticated={isAuthenticated}
            onJoinRoom={onJoinRoom}
            onViewRoom={onViewRoom}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliberationRoomCard;