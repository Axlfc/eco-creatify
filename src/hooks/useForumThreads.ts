import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as forumApi from "@/api/forum";
import { ForumThread, ForumComment, ForumTip, ModerationResult, ForumUserProfile } from "@/types/forum";

// Hook principal para el sistema de ayuda y propinas en el foro
export function useForumThreads() {
  const queryClient = useQueryClient();

  // Obtener todos los hilos
  const threadsQuery = useQuery<ForumThread[]>(["forum-threads"], forumApi.getThreads);

  // Crear un nuevo hilo
  const createThread = useMutation(forumApi.createThread, {
    onSuccess: () => queryClient.invalidateQueries(["forum-threads"]),
  });

  // Obtener comentarios de un hilo
  function useComments(threadId: string) {
    return useQuery<ForumComment[]>(["forum-comments", threadId], () => forumApi.getComments(threadId));
  }

  // Añadir comentario
  const addComment = useMutation(forumApi.addComment, {
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(["forum-comments", variables.threadId]);
    },
  });

  // Propinas (mock)
  const sendTip = useMutation(forumApi.sendTip, {
    // TODO: Integrar con smart contract de propinas (Web3/Ethers.js) aquí
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries(["forum-tips", variables.threadId]);
    },
  });

  function useTips(threadId: string) {
    return useQuery<ForumTip[]>(["forum-tips", threadId], () => forumApi.getTips(threadId));
  }

  // Moderación automática (AutoMod)
  export const useModeration = () => {
    // Analiza un mensaje antes de enviarlo
    const moderate = useMutation((text: string) => forumApi.moderateMessage(text));
    return { moderate };
  };

  // Hook para obtener perfil de usuario y reputación
  export const useUserProfile = (username: string) => {
    return useQuery<ForumUserProfile | undefined>(["forum-user-profile", username], () => forumApi.getUserProfile(username));
  };

  // Hook para actualizar reputación (mock)
  export const useUpdateReputation = () => {
    const queryClient = useQueryClient();
    return useMutation(
      ({ username, delta }: { username: string; delta: number }) => forumApi.updateReputation(username, delta),
      {
        onSuccess: (_data, variables) => {
          queryClient.invalidateQueries(["forum-user-profile", variables.username]);
        },
      }
    );
  };

  return {
    threadsQuery,
    createThread,
    useComments,
    addComment,
    sendTip,
    useTips,
    useModeration,
    useUserProfile,
    useUpdateReputation,
  };
}

// Test básico (puede ampliarse)
// TODO: Añadir pruebas unitarias más completas
// import { renderHook } from "@testing-library/react";
// describe("useForumThreads", () => { ... });
