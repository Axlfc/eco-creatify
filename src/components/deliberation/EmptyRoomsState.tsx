import React from "react";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface EmptyRoomsStateProps {
  isAuthenticated: boolean;
  onCreateRoom: () => void;
}

const EmptyRoomsState: React.FC<EmptyRoomsStateProps> = ({
  isAuthenticated,
  onCreateRoom
}) => {
  return (
    <div className="text-center py-10 bg-muted/30 rounded-md">
      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
      <h3 className="font-medium mb-2">No deliberation rooms available</h3>
      <p className="text-sm text-muted-foreground mb-4">
        No hay salas de deliberación activas. ¡Sé el primero en crear una!
      </p>
      {isAuthenticated && (
        <Button onClick={onCreateRoom} variant="outline">
          Create First Room
        </Button>
      )}
    </div>
  );
};

export default EmptyRoomsState;