
import { supabase } from '@/integrations/supabase/client';
import { 
  ConflictResolution, 
  ConflictResolutionProgress, 
  Stage, 
  ConflictPosition,
  CommonGround,
  DisagreementPoint,
  Evidence,
  ProposedSolution,
  MediationRequest
} from '@/types/conflictResolution';

export interface ConflictResolutionWithDetails extends ConflictResolution {
  details: {
    positionA: ConflictPosition;
    positionB: ConflictPosition;
    progress: ConflictResolutionProgress;
  }
}

// Helper function to safely cast JSON data to specific types
function safeCast<T>(data: any, defaultValue?: T): T {
  if (!data) {
    return defaultValue as T;
  }
  if (typeof data === 'string') {
    try {
      return JSON.parse(data) as T;
    } catch (e) {
      return defaultValue as T;
    }
  }
  return data as T;
}

export async function getConflictResolutions(): Promise<ConflictResolution[]> {
  try {
    const { data, error } = await supabase
      .from('conflict_resolutions')
      .select('*');
      
    if (error) {
      console.error('Error fetching conflict resolutions:', error);
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    // Transform the data into our application's expected structure
    return data.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      partyA: item.party_a,
      partyB: item.party_b,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      userId: item.created_by || '',
      positionA: safeCast<ConflictPosition>(item.position_a, { content: '' }),
      positionB: safeCast<ConflictPosition>(item.position_b, { content: '' }),
      progress: safeCast<ConflictResolutionProgress>(item.progress, {
        current_stage: Stage.Articulation,
        completed_stages: [],
        stage_progress: {}
      }),
      commonGround: safeCast<CommonGround>(item.common_ground),
      disagreementPoints: safeCast<DisagreementPoint[]>(item.disagreement_points, []),
      evidenceList: safeCast<Evidence[]>(item.evidence_list, []),
      proposedSolutions: safeCast<ProposedSolution[]>(item.proposed_solutions, []),
      mediationRequest: safeCast<MediationRequest>(item.mediation_request),
      consensusReached: item.consensus_reached || false,
      isPublic: item.is_public || false
    }));
  } catch (error) {
    console.error('Failed to fetch conflict resolutions:', error);
    throw error;
  }
}

export async function getConflictResolutionById(id: string): Promise<ConflictResolution> {
  try {
    const { data, error } = await supabase
      .from('conflict_resolutions')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error(`Error fetching conflict resolution with id ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      throw new Error(`No conflict resolution found with id ${id}`);
    }
    
    // Transform the data into our application's expected structure
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      partyA: data.party_a,
      partyB: data.party_b,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.created_by || '',
      positionA: safeCast<ConflictPosition>(data.position_a, { content: '' }),
      positionB: safeCast<ConflictPosition>(data.position_b, { content: '' }),
      progress: safeCast<ConflictResolutionProgress>(data.progress, {
        current_stage: Stage.Articulation,
        completed_stages: [],
        stage_progress: {}
      }),
      commonGround: safeCast<CommonGround>(data.common_ground),
      disagreementPoints: safeCast<DisagreementPoint[]>(data.disagreement_points, []),
      evidenceList: safeCast<Evidence[]>(data.evidence_list, []),
      proposedSolutions: safeCast<ProposedSolution[]>(data.proposed_solutions, []),
      mediationRequest: safeCast<MediationRequest>(data.mediation_request),
      consensusReached: data.consensus_reached || false,
      isPublic: data.is_public || false
    };
  } catch (error) {
    console.error(`Failed to fetch conflict resolution with id ${id}:`, error);
    throw error;
  }
}

export async function createConflictResolution(resolution: Partial<ConflictResolution>): Promise<string> {
  try {
    // Convert from our application structure to the database structure
    const { data, error } = await supabase
      .from('conflict_resolutions')
      .insert({
        title: resolution.title,
        description: resolution.description,
        party_a: resolution.partyA,
        party_b: resolution.partyB,
        position_a: resolution.positionA,
        position_b: resolution.positionB,
        common_ground: resolution.commonGround,
        disagreement_points: resolution.disagreementPoints,
        evidence_list: resolution.evidenceList,
        proposed_solutions: resolution.proposedSolutions,
        mediation_request: resolution.mediationRequest,
        progress: resolution.progress || {
          current_stage: Stage.Articulation,
          completed_stages: [],
          stage_progress: {}
        },
        consensus_reached: resolution.consensusReached,
        is_public: resolution.isPublic,
        created_by: resolution.userId
      })
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating conflict resolution:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('Failed to create conflict resolution');
    }
    
    return data.id;
  } catch (error) {
    console.error('Failed to create conflict resolution:', error);
    throw error;
  }
}

export async function updateConflictResolution(id: string, updates: Partial<ConflictResolution>): Promise<void> {
  try {
    // Convert from our application structure to the database structure
    const dbUpdates: any = {};
    
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.description) dbUpdates.description = updates.description;
    if (updates.partyA) dbUpdates.party_a = updates.partyA;
    if (updates.partyB) dbUpdates.party_b = updates.partyB;
    if (updates.positionA) dbUpdates.position_a = updates.positionA;
    if (updates.positionB) dbUpdates.position_b = updates.positionB;
    if (updates.commonGround) dbUpdates.common_ground = updates.commonGround;
    if (updates.disagreementPoints) dbUpdates.disagreement_points = updates.disagreementPoints;
    if (updates.evidenceList) dbUpdates.evidence_list = updates.evidenceList;
    if (updates.proposedSolutions) dbUpdates.proposed_solutions = updates.proposedSolutions;
    if (updates.mediationRequest) dbUpdates.mediation_request = updates.mediationRequest;
    if (updates.progress) dbUpdates.progress = updates.progress;
    if (updates.consensusReached !== undefined) dbUpdates.consensus_reached = updates.consensusReached;
    if (updates.isPublic !== undefined) dbUpdates.is_public = updates.isPublic;
    
    // Add updated_at timestamp
    dbUpdates.updated_at = new Date().toISOString();
    
    const { error } = await supabase
      .from('conflict_resolutions')
      .update(dbUpdates)
      .eq('id', id);
    
    if (error) {
      console.error(`Error updating conflict resolution with id ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Failed to update conflict resolution with id ${id}:`, error);
    throw error;
  }
}

export async function deleteConflictResolution(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('conflict_resolutions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting conflict resolution with id ${id}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Failed to delete conflict resolution with id ${id}:`, error);
    throw error;
  }
}

// Create a single export for mocking in tests
export const conflictResolutionService = {
  getConflictResolutions,
  getConflictResolutionById,
  createConflictResolution,
  updateConflictResolution,
  deleteConflictResolution,
  // Mock methods for tests
  updateCommonGround: async () => ({} as ConflictResolution),
  updateDisagreementPoints: async () => ({} as ConflictResolution),
  addEvidence: async () => ({} as ConflictResolution),
  proposeolutions: async () => ({} as ConflictResolution),
  buildConsensus: async () => ({} as ConflictResolution),
  getProgressHistory: async () => [] as any[],
  getVisualizationData: async () => ({} as any),
  requestMediation: async () => ({} as ConflictResolution),
  assignMediator: async () => ({} as ConflictResolution),
  getConflictResolution: getConflictResolutionById
};
