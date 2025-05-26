
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Plus,
  Clock,
  MessageSquare,
  Vote,
  CheckCircle,
  AlertTriangle,
  Calendar,
  UserPlus,
  Eye
} from "lucide-react";

interface DeliberationRoomsListProps {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
}

// Mock data for deliberation rooms
const mockRooms = [
  {
    id: "1",
    title: "Climate Action Budget Allocation",
    description: "Discussing how to allocate the climate action budget across different initiatives",
    status: "active" as const,
    participants: 12,
    maxParticipants: 20,
    createdBy: "ClimateAdvocate",
    createdAt: "2024-01-15",
    deadline: "2024-01-25",
    category: "Environment",
    phase: "discussion",
    consensusLevel: 65
  },
  {
    id: "2",
    title: "Community Garden Location Selection",
    description: "Choosing the best location for the new community garden project",
    status: "open" as const,
    participants: 8,
    maxParticipants: 15,
    createdBy: "GreenThumb",
    createdAt: "2024-01-16",
    deadline: "2024-01-30",
    category: "Community",
    phase: "presentation",
    consensusLevel: 85
  },
  {
    id: "3",
    title: "Digital Privacy Guidelines",
    description: "Establishing community guidelines for digital privacy and data protection",
    status: "completed" as const,
    participants: 15,
    maxParticipants: 15,
    createdBy: "PrivacyAdvocate",
    createdAt: "2024-01-10",
    deadline: "2024-01-20",
    category: "Technology",
    phase: "completed",
    consensusLevel: 78
  }
];

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

const DeliberationRoomsList: React.FC<DeliberationRoomsListProps> = ({ 
  isAuthenticated, 
  userId, 
  username 
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!isAuthenticated) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para crear una sala de deliberación",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    // TODO: Implementar formulario de creación de sala
    toast({
      title: "Feature en desarrollo",
      description: "La creación de salas de deliberación estará disponible próximamente",
      variant: "default"
    });
  };

  const handleJoinRoom = (roomId: string, roomTitle: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Autenticación requerida",
        description: "Debes iniciar sesión para unirte a salas de deliberación",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    // TODO: Implementar lógica de unirse a sala
    toast({
      title: "Uniéndose a sala",
      description: `Te estás uniendo a "${roomTitle}". Esta funcionalidad estará disponible próximamente`,
      variant: "default"
    });
  };

  const handleViewRoom = (roomId: string, roomTitle: string) => {
    // TODO: Implementar vista de detalle de sala
    // navigate(`/deliberation/room/${roomId}`);
    toast({
      title: "Vista de sala",
      description: `Vista detallada de "${roomTitle}" estará disponible próximamente`,
      variant: "default"
    });
  };

  const getConsensusColor = (level: number) => {
    if (level >= 80) return "text-green-600 bg-green-50";
    if (level >= 60) return "text-blue-600 bg-blue-50";
    if (level >= 40) return "text-amber-600 bg-amber-50";
    return "text-red-600 bg-red-50";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Deliberation Rooms
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Espacios estructurados para deliberación comunitaria y toma de decisiones colaborativa
              </p>
            </div>
            <Button 
              onClick={handleCreateRoom}
              className="flex items-center gap-2"
              disabled={!isAuthenticated}
              title={!isAuthenticated ? "Inicia sesión para crear salas" : "Crear nueva sala"}
            >
              <Plus className="h-4 w-4" />
              New Room
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!isAuthenticated && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">Autenticación requerida</span>
              </div>
              <p className="text-sm text-blue-700 mb-3">
                Para participar en salas de deliberación, crear nuevas salas, o votar, necesitas iniciar sesión.
              </p>
              <Button 
                size="sm" 
                onClick={() => navigate("/auth")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Iniciar sesión
              </Button>
            </div>
          )}

          <div className="grid gap-4">
            {mockRooms.length > 0 ? (
              mockRooms.map((room) => {
                const config = statusConfig[room.status];
                const canJoin = room.status !== 'completed' && room.participants < room.maxParticipants;
                const isFullyBooked = room.participants >= room.maxParticipants && room.status !== 'completed';
                
                return (
                  <Card key={room.id} className={`${config.border} hover:shadow-md transition-shadow`}>
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
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewRoom(room.id, room.title)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          
                          {canJoin && !isFullyBooked && (
                            <Button
                              size="sm"
                              onClick={() => handleJoinRoom(room.id, room.title)}
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
                              onClick={() => handleJoinRoom(room.id, room.title)}
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
                              onClick={() => handleViewRoom(room.id, room.title)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Results
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-10 bg-muted/30 rounded-md">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="font-medium mb-2">No deliberation rooms available</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  No hay salas de deliberación activas. ¡Sé el primero en crear una!
                </p>
                {isAuthenticated && (
                  <Button onClick={handleCreateRoom} variant="outline">
                    Create First Room
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliberationRoomsList;
