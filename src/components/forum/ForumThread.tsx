import React, { useState } from "react";
import { useForumThreads, useModeration, useUserProfile, useUpdateReputation } from "@/hooks/useForumThreads";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import AutoModStatus from "@/components/moderation/AutoModStatus";

interface ForumThreadProps {
  thread: import("@/types/forum").ForumThread;
}

/**
 * Vista de un hilo de foro y sus respuestas.
 * TODO: Mostrar hilo, comentarios anidados, reportes y moderación.
 */
const ForumThread: React.FC<ForumThreadProps> = ({ thread }) => {
  const [showDetail, setShowDetail] = useState(false);
  return (
    <div className="border rounded p-3 bg-white">
      <div className="flex justify-between items-center">
        <div>
          <strong>{thread.title}</strong> <span className="text-xs text-muted-foreground">({thread.helpType === "help-request" ? "Petición" : "Oferta"})</span>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setShowDetail(v => !v)}>
          {showDetail ? "Ocultar" : "Ver"}
        </Button>
      </div>
      {showDetail && <ForumThreadDetail thread={thread} />}
    </div>
  );
};

// Detalle de hilo: respuestas, log y propinas
const ForumThreadDetail: React.FC<{ thread: import("@/types/forum").ForumThread }> = ({ thread }) => {
  const { useComments, addComment, useTips, sendTip } = useForumThreads();
  const { data: comments = [], isLoading: loadingComments } = useComments(thread.id);
  const { data: tips = [] } = useTips(thread.id);
  const [reply, setReply] = useState("");
  const { toast } = useToast();
  const moderate = useModeration();
  const [lastModeration, setLastModeration] = useState<any>(null);
  const { data: userProfile } = useUserProfile(thread.author);
  const updateReputation = useUpdateReputation();

  const handleReply = () => {
    moderate.mutate(reply, {
      onSuccess: (result) => {
        setLastModeration(result);
        if (result.status === "clean") {
          addComment.mutate(
            { threadId: thread.id, content: reply, author: "mockUser" },
            {
              onSuccess: () => {
                setReply("");
                toast({ title: "Respuesta publicada" });
                updateReputation.mutate({ username: thread.author, delta: 1 });
              },
              onError: () => toast({ title: "Error al responder", variant: "destructive" }),
            }
          );
        } else {
          toast({ title: "Mensaje bloqueado por AutoMod", description: result.reason, variant: "destructive" });
        }
      },
    });
  };

  const handleTip = (toUser: string) => {
    sendTip.mutate(
      { fromUser: "mockUser", toUser, threadId: thread.id, amount: 1 },
      {
        onSuccess: () => {
          toast({ title: "Propina enviada (mock)" });
          updateReputation.mutate({ username: toUser, delta: 2 });
        },
        onError: () => toast({ title: "Error al enviar propina", variant: "destructive" }),
      }
    );
    // TODO: Integrar con smart contract de propinas reales (Web3/Ethers.js)
  };

  return (
    <div className="mt-3 border-t pt-3 space-y-2">
      <div className="text-sm text-muted-foreground">{thread.content}</div>
      <div className="mt-2">
        <strong>Respuestas</strong>
        {loadingComments ? (
          <div>Cargando respuestas...</div>
        ) : (
          <ul className="space-y-1 mt-2">
            {comments.map(c => (
              <li key={c.id} className="flex justify-between items-center border-b pb-1">
                <span>{c.content} <span className="text-xs text-muted-foreground">por {c.author}</span></span>
                <Button size="sm" variant="outline" onClick={() => handleTip(c.author)}>Propina</Button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2 mt-2">
          <input
            className="flex-1 border rounded p-1"
            placeholder="Responder..."
            value={reply}
            onChange={e => setReply(e.target.value)}
          />
          <Button size="sm" onClick={handleReply} disabled={addComment.isPending}>Enviar</Button>
        </div>
        <AutoModStatus lastResult={lastModeration} />
      </div>
      <div className="mt-2">
        <strong>Log de propinas</strong>
        <ul className="text-xs mt-1">
          {tips.map(tip => (
            <li key={tip.id}>
              {tip.fromUser} → {tip.toUser}: {tip.amount} tip (mock) <span className="text-muted-foreground">{new Date(tip.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <strong>Reputación de {thread.author}:</strong> {userProfile?.reputation ?? 0}
      </div>
      {/* TODO: Mostrar log IRC-like de toda la actividad (respuestas, propinas, etc) */}
    </div>
  );
};

export default ForumThread;
