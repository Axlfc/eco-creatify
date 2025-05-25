import React from "react";
import ForumThreadList from "@/components/forum/ForumThreadList";

/**
 * Página principal del foro de debates y preguntas.
 * Integra listado de hilos, creación de hilos, respuestas y propinas.
 * TODO: Integrar moderación automática y conexión con backend/Web3.
 */
const ForumPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Foro de Ayuda y Propinas</h1>
      <ForumThreadList />
    </div>
  );
};

export default ForumPage;
