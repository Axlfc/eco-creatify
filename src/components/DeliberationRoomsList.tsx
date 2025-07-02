
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Users, Plus, UserPlus } from "lucide-react";
import DeliberationRoomCard from "./deliberation/DeliberationRoomCard";
import EmptyRoomsState from "./deliberation/EmptyRoomsState";

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
              mockRooms.map((room) => (
                <DeliberationRoomCard
                  key={room.id}
                  room={room}
                  isAuthenticated={isAuthenticated}
                  onJoinRoom={handleJoinRoom}
                  onViewRoom={handleViewRoom}
                />
              ))
            ) : (
              <EmptyRoomsState
                isAuthenticated={isAuthenticated}
                onCreateRoom={handleCreateRoom}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliberationRoomsList;
