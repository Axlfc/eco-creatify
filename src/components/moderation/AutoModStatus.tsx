import React from "react";
import { useModeration } from "@/hooks/useForumThreads";

/**
 * Estado y feedback del sistema AutoMod.
 * Muestra el estado de moderación automática, alertas y logs.
 * TODO: Integrar con backend de moderación real.
 */
const AutoModStatus: React.FC<{ lastResult?: { status: string; reason?: string } }> = ({ lastResult }) => {
  if (!lastResult) return null;
  return (
    <div className="my-2 p-2 rounded bg-muted text-sm">
      <span className={
        lastResult.status === "clean"
          ? "text-green-600"
          : lastResult.status === "flagged"
          ? "text-yellow-600"
          : "text-red-600"
      }>
        {lastResult.status === "clean" && "Mensaje limpio (AutoMod)"}
        {lastResult.status === "flagged" && `Posible problema: ${lastResult.reason}`}
        {lastResult.status === "blocked" && `Bloqueado: ${lastResult.reason}`}
      </span>
    </div>
  );
};

export default AutoModStatus;
