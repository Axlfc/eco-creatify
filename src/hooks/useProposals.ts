
import { useState, useCallback } from 'react';

// Mock implementation for useProposals hook
export function useProposals() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProposal = useCallback(async (proposalData: any) => {
    setLoading(true);
    setError(null);
    try {
      // Mock API call
      const response = await new Promise((resolve) => 
        setTimeout(() => resolve({ id: Date.now().toString(), ...proposalData }), 1000)
      );
      return response;
    } catch (err) {
      setError('Error creating proposal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProposal = useCallback(async (proposalData: any) => {
    setLoading(true);
    setError(null);
    try {
      // Mock API call
      const response = await new Promise((resolve) => 
        setTimeout(() => resolve({ ...proposalData }), 1000)
      );
      return response;
    } catch (err) {
      setError('Error updating proposal');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProposalById = useCallback((id: string) => {
    // Mock proposal data
    return {
      id,
      title: 'Mock Proposal',
      description: 'This is a mock proposal for testing',
      tags: ['test', 'mock'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, []);

  return {
    createProposal,
    updateProposal,
    getProposalById,
    loading,
    error,
  };
}
