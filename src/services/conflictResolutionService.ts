import { ConflictResolution, ConflictResolutionCategory, ConflictResolutionPriority } from "@/types/conflictResolution";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ConflictResolutionService {
  async createConflictResolution(data: ConflictResolution): Promise<ConflictResolution> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newConflictResolution: ConflictResolution = {
          ...data,
          id: Math.random().toString(36).substring(2, 15),
          status: 'open',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        resolve(newConflictResolution);
      }, 500);
    });
  }

  async getConflictResolutionById(id: string): Promise<ConflictResolution | null> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockConflictResolution: ConflictResolution = {
          id: id,
          title: 'Mock Conflict Resolution',
          description: 'This is a mock conflict resolution for testing purposes.',
          category: 'governance' as ConflictResolutionCategory,
          priority: 'high' as ConflictResolutionPriority,
          reporter_id: 'user123',
          status: 'open',
          affected_proposal_id: 'proposal456',
          evidence: 'Mock evidence URL',
          desired_outcome: 'Resolution of the conflict',
          timeline: '1 week',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        resolve(mockConflictResolution);
      }, 300);
    });
  }

  async updateConflictResolution(id: string, updates: Partial<ConflictResolution>): Promise<ConflictResolution | null> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockConflictResolution: ConflictResolution = {
          id: id,
          title: 'Mock Conflict Resolution',
          description: 'This is a mock conflict resolution for testing purposes.',
          category: 'governance' as ConflictResolutionCategory,
          priority: 'high' as ConflictResolutionPriority,
          reporter_id: 'user123',
          status: 'open',
          affected_proposal_id: 'proposal456',
          evidence: 'Mock evidence URL',
          desired_outcome: 'Resolution of the conflict',
          timeline: '1 week',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...updates,
        };
        resolve(mockConflictResolution);
      }, 400);
    });
  }

  validateResolutionData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Basic validation
    if (!data || typeof data !== 'object') {
      errors.push('Invalid data format');
      return { isValid: false, errors };
    }

    // Required fields validation
    const requiredFields = [
      'title', 'description', 'category', 'priority', 'reporter_id',
      'affected_proposal_id', 'evidence', 'desired_outcome', 'timeline'
    ];

    // Use Object.prototype.hasOwnProperty.call instead of Object.hasOwn for compatibility
    for (const field of requiredFields) {
      if (!Object.prototype.hasOwnProperty.call(data, field) || !data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Specific field validations
    if (data.category && !['governance', 'technical', 'community', 'financial'].includes(data.category)) {
      errors.push('Invalid category');
    }
    if (data.priority && !['high', 'medium', 'low'].includes(data.priority)) {
      errors.push('Invalid priority');
    }
    
    if (typeof data.evidence !== 'string' || data.evidence.length < 10) {
      errors.push('Evidence must be a valid string URL or description');
    }

    return { isValid: errors.length === 0, errors };
  }

  async escalateConflict(id: string): Promise<ConflictResolution | null> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockConflictResolution: ConflictResolution = {
          id: id,
          title: 'Mock Conflict Resolution',
          description: 'This is a mock conflict resolution for testing purposes.',
          category: 'governance' as ConflictResolutionCategory,
          priority: 'high' as ConflictResolutionPriority,
          reporter_id: 'user123',
          status: 'escalated',
          affected_proposal_id: 'proposal456',
          evidence: 'Mock evidence URL',
          desired_outcome: 'Resolution of the conflict',
          timeline: '1 week',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        resolve(mockConflictResolution);
      }, 600);
    });
  }
}

export const conflictResolutionService = new ConflictResolutionService();
