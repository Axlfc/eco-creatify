
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface AutoModStatusProps {
  lastResult?: {
    status: 'clean' | 'flagged' | 'blocked';
    reason?: string;
  } | null;
}

const AutoModStatus: React.FC<AutoModStatusProps> = ({ lastResult }) => {
  if (!lastResult) return null;

  const getStatusConfig = () => {
    switch (lastResult.status) {
      case 'clean':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          variant: 'default' as const,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          text: 'Contenido aprobado'
        };
      case 'flagged':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          variant: 'secondary' as const,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          text: 'Contenido marcado para revisión'
        };
      case 'blocked':
        return {
          icon: <XCircle className="h-4 w-4" />,
          variant: 'destructive' as const,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          text: 'Contenido bloqueado'
        };
      default:
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          variant: 'default' as const,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          text: 'Estado desconocido'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`flex items-center gap-2 p-2 rounded-md ${config.bgColor} mt-2`}>
      <div className={config.color}>
        {config.icon}
      </div>
      <span className={`text-sm ${config.color}`}>
        {config.text}
      </span>
      {lastResult.reason && (
        <Badge variant={config.variant} className="ml-auto">
          {lastResult.reason}
        </Badge>
      )}
    </div>
  );
};

export default AutoModStatus;
