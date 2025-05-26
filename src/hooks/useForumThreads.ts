
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ForumThread, ForumComment, ForumTip, ModerationResult, ForumUserProfile } from '@/types/forum';

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
  const threadsQuery = useQuery({
    queryKey: ['forum-threads'],
    queryFn: async (): Promise<ForumThread[]> => {
      // Mock API call - replace with real API
      return Promise.resolve(mockThreads);
    },
  });

  const createThread = useMutation({
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

  const useComments = (threadId: string) => {
    return useQuery({
      queryKey: ['forum-comments', threadId],
      queryFn: async (): Promise<ForumComment[]> => {
        // Mock API call
        return Promise.resolve([]);
      },
    });
  };

  const addComment = useMutation({
    mutationFn: async (newComment: Omit<ForumComment, 'id' | 'createdAt'>): Promise<ForumComment> => {
      // Mock API call
      const comment: ForumComment = {
        ...newComment,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      return Promise.resolve(comment);
    },
  });

  const useTips = (threadId: string) => {
    return useQuery({
      queryKey: ['forum-tips', threadId],
      queryFn: async (): Promise<ForumTip[]> => {
        // Mock API call
        return Promise.resolve([]);
      },
    });
  };

  const sendTip = useMutation({
    mutationFn: async (newTip: Omit<ForumTip, 'id' | 'createdAt'>): Promise<ForumTip> => {
      // Mock API call
      const tip: ForumTip = {
        ...newTip,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      return Promise.resolve(tip);
    },
  });

  const queryClient = useQueryClient();

  return {
    threadsQuery,
    createThread,
    useComments,
    addComment,
    useTips,
    sendTip,
  };
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

export const useModeration = () => {
  return useMutation({
    mutationFn: async (content: string): Promise<ModerationResult> => {
      // Mock moderation check
      if (content.toLowerCase().includes('spam') || content.toLowerCase().includes('banned')) {
        return { status: 'blocked', reason: 'Content flagged as inappropriate' };
      }
      return { status: 'clean' };
    },
  });
};

export const useUserProfile = (username: string) => {
  return useQuery({
    queryKey: ['user-profile', username],
    queryFn: async (): Promise<ForumUserProfile> => {
      // Mock user profile
      return {
        username,
        displayName: username,
        reputation: Math.floor(Math.random() * 100),
      };
    },
  });
};

export const useUpdateReputation = () => {
  return useMutation({
    mutationFn: async ({ username, delta }: { username: string; delta: number }) => {
      // Mock reputation update
      console.log(`Updated reputation for ${username} by ${delta}`);
      return { success: true };
    },
  });
};
