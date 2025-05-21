
import { supabase, ConflictResolutionData } from '@/integrations/supabase/client';
import { 
  ConflictResolution, 
  ConflictResolutionProgress, 
  Stage, 
  ConflictPosition 
} from '@/types/conflictResolution';

export interface ConflictResolutionWithDetails extends ConflictResolution {
  details: {
    positionA: ConflictPosition;
    positionB: ConflictPosition;
    progress: ConflictResolutionProgress;
  }
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
      positionA: item.position_a as ConflictPosition,
      positionB: item.position_b as ConflictPosition,
      progress: item.progress as ConflictResolutionProgress,
      commonGround: item.common_ground,
      disagreementPoints: item.disagreement_points,
      evidenceList: item.evidence_list,
      proposedSolutions: item.proposed_solutions,
      mediationRequest: item.mediation_request,
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
      positionA: data.position_a as ConflictPosition,
      positionB: data.position_b as ConflictPosition,
      progress: data.progress as ConflictResolutionProgress,
      commonGround: data.common_ground,
      disagreementPoints: data.disagreement_points,
      evidenceList: data.evidence_list,
      proposedSolutions: data.proposed_solutions,
      mediationRequest: data.mediation_request,
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
