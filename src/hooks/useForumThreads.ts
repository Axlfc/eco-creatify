
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ForumThread, ForumComment, ForumTip } from '@/types/forum';

// Mock data for development
const mockThreads: ForumThread[] = [
  {
    id: '1',
    title: 'How to get started with React?',
    content: 'I\'m new to React and looking for some guidance...',
    category: 'help-request',
    author: 'newbie123',
    createdAt: new Date().toISOString(),
    helpType: 'help-request',
    isOpen: true,
  }
];

export const useForumThreads = () => {
  return useQuery({
    queryKey: ['forum-threads'],
    queryFn: async (): Promise<ForumThread[]> => {
      // Mock API call - replace with real API
      return Promise.resolve(mockThreads);
    },
  });
};

export const useCreateThread = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newThread: Omit<ForumThread, 'id' | 'createdAt'>): Promise<ForumThread> => {
      // Mock API call - replace with real API
      const thread: ForumThread = {
        ...newThread,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      return Promise.resolve(thread);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-threads'] });
    },
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newComment: Omit<ForumComment, 'id' | 'createdAt'>): Promise<ForumComment> => {
      // Mock API call - replace with real API
      const comment: ForumComment = {
        ...newComment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      return Promise.resolve(comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-comments'] });
    },
  });
};

export const useCreateTip = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newTip: Omit<ForumTip, 'id' | 'createdAt'>): Promise<ForumTip> => {
      // Mock API call - replace with real API
      const tip: ForumTip = {
        ...newTip,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      return Promise.resolve(tip);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['forum-tips'] });
    },
  });
};
