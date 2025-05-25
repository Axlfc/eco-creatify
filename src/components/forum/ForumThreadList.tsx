import React, { useState } from "react";
import { useForumThreads } from "@/hooks/useForumThreads";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ForumThread from "./ForumThread";

/**
 * Listado de hilos del foro de ayuda y propinas.
 * Permite crear hilos, ver peticiones de ayuda, y navegar a cada hilo.
 */
const ForumThreadList: React.FC = () => {
  const { threadsQuery, createThread } = useForumThreads();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [helpType, setHelpType] = useState<"help-request" | "help-offer">("help-request");
  const { toast } = useToast();

  const handleCreate = () => {
    if (!title.trim() || !content.trim()) {
      toast({ title: "Completa todos los campos", variant: "destructive" });
      return;
    }
    createThread.mutate(
      { title, content, category, helpType, isOpen: true, author: "mockUser" },
      {
        onSuccess: () => {
          toast({ title: "Hilo creado" });
          setShowForm(false);
          setTitle("");
          setContent("");
        },
        onError: () => toast({ title: "Error al crear hilo", variant: "destructive" }),
      }
    );
  };

  if (threadsQuery.isLoading) return <div>Cargando hilos...</div>;
  if (threadsQuery.isError) return <div>Error al cargar hilos</div>;

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Canales de ayuda</h2>
        <Button onClick={() => setShowForm((v) => !v)}>{showForm ? "Cancelar" : "Pedir ayuda"}</Button>
      </div>
      {showForm && (
        <div className="mb-4 p-4 border rounded bg-muted">
          <input
            className="mb-2 w-full p-2 border rounded"
            placeholder="Título del canal o petición"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <textarea
            className="mb-2 w-full p-2 border rounded"
            placeholder="Describe tu problema o petición"
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <select className="mb-2 w-full p-2 border rounded" value={helpType} onChange={e => setHelpType(e.target.value as any)}>
            <option value="help-request">Pedir ayuda</option>
            <option value="help-offer">Ofrecer ayuda</option>
          </select>
          <Button onClick={handleCreate} disabled={createThread.isLoading}>Crear</Button>
        </div>
      )}
      <div className="space-y-4">
        {threadsQuery.data?.map(thread => (
          <ForumThread key={thread.id} thread={thread} />
        ))}
      </div>
    </div>
  );
};

export default ForumThreadList;
