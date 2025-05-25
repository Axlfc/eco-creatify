/**
 * ModerationLog.tsx
 *
 * Componente para visualizar logs y acciones de moderación.
 * Integra el hook/contexto de moderación (useModeration o ModerationContext).
 * Permite a moderadores ver reportes, bloqueos y acciones tomadas sobre contenido.
 *
 * @todo Integrar con API real de moderación y AutoMod.
 * @todo Migrar lógica legacy de logs de moderación a este componente y eliminar duplicidad progresivamente.
 */
import React, { useEffect, useState } from 'react';
// TODO: Importar useModeration o ModerationContext cuando esté implementado
// import { useModeration } from '../../hooks/useModeration';

// Mock temporal de logs de moderación
const mockLogs = [
  {
    id: 'log1',
    targetType: 'comment',
    targetId: 'c1',
    action: 'blocked',
    reason: 'Lenguaje ofensivo',
    moderator: 'Mod1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'log2',
    targetType: 'proposal',
    targetId: 'p2',
    action: 'reviewed',
    reason: 'Reporte de spam',
    moderator: 'Mod2',
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

const ModerationLog: React.FC = () => {
  // const { logs, loading, error } = useModeration(); // TODO: Descomentar cuando esté implementado
  const [logs, setLogs] = useState(mockLogs);
  const loading = false;
  const error = null;

  // TODO: Reemplazar por fetch real a la API de moderación
  useEffect(() => {
    // Simula polling o fetch inicial
    setLogs(mockLogs);
  }, []);

  if (loading) return <div>Cargando logs de moderación...</div>;
  if (error) return <div className="text-red-600">Error al cargar logs.</div>;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded shadow p-4 mt-6">
      <h3 className="text-lg font-bold mb-3">Logs de moderación</h3>
      {logs.length === 0 ? (
        <div className="text-gray-500">No hay acciones de moderación registradas.</div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th>Fecha</th>
              <th>Tipo</th>
              <th>ID</th>
              <th>Acción</th>
              <th>Motivo</th>
              <th>Moderador</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b hover:bg-gray-50">
                <td>{new Date(log.createdAt).toLocaleString()}</td>
                <td>{log.targetType}</td>
                <td>{log.targetId}</td>
                <td>{log.action}</td>
                <td>{log.reason}</td>
                <td>{log.moderator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ModerationLog;
// TODO: Integrar este componente en el panel de administración/moderación.
// TODO: Migrar lógica legacy de logs de moderación a este componente y eliminar duplicidad progresivamente.
