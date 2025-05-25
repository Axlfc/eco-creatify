/**
 * NotificationList.tsx
 *
 * Componente para mostrar las notificaciones del usuario (reputación, respuestas, menciones, moderación, etc.).
 * Integra el contexto global de notificaciones (NotificationContext) y soporta mock API/polling.
 * Preparado para integración con backend real, Web3 y feedback de reputación.
 *
 * @todo Integrar con API real de notificaciones y Web3.
 * @todo Migrar lógica legacy de notificaciones a este componente y eliminar duplicidad progresivamente.
 */
import React, { useContext, useEffect, useState } from 'react';
import { NotificationContext } from '../../context/NotificationContext';
// TODO: Importar tipo Notification desde types/notification cuando esté disponible

// Mock temporal de notificaciones
const mockNotifications = [
  {
    id: 'n1',
    type: 'reputation',
    message: '¡Tu reputación ha subido a 120 puntos!',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    id: 'n2',
    type: 'reply',
    message: 'Tienes una nueva respuesta en tu propuesta.',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'n3',
    type: 'moderation',
    message: 'Un comentario tuyo fue reportado y está bajo revisión.',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
];

const NotificationList: React.FC = () => {
  const notificationCtx = useContext(NotificationContext);
  // TODO: Reemplazar por notificaciones reales del contexto/API
  const [notifications, setNotifications] = useState(mockNotifications);
  const [loading, setLoading] = useState(false);

  // Simula polling para notificaciones nuevas (mock)
  useEffect(() => {
    const interval = setInterval(() => {
      // TODO: Reemplazar por fetch real a la API de notificaciones
      setNotifications((prev) => [...prev]);
    }, 15000); // 15s
    return () => clearInterval(interval);
  }, []);

  // Marcar como leída
  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n));
    notificationCtx?.markAsRead?.(id); // TODO: Implementar en contexto real
  };

  if (loading) return <div>Cargando notificaciones...</div>;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded shadow p-4">
      <h3 className="text-lg font-bold mb-3">Notificaciones</h3>
      {notifications.length === 0 ? (
        <div className="text-gray-500">No tienes notificaciones nuevas.</div>
      ) : (
        <ul className="divide-y">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`py-3 px-2 flex items-start gap-2 cursor-pointer ${n.read ? 'bg-gray-100' : 'bg-blue-50'}`}
              onClick={() => markAsRead(n.id)}
            >
              <span className="inline-block w-2 h-2 rounded-full mt-2" style={{ background: n.read ? '#bbb' : '#2563eb' }} />
              <div>
                <div className="font-medium text-sm">{n.message}</div>
                <div className="text-xs text-gray-400">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
// TODO: Integrar este componente en el Dashboard o topbar según la arquitectura.
// TODO: Migrar lógica legacy de notificaciones a este componente y eliminar duplicidad progresivamente.
