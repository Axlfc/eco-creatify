
import { supabase } from "@/integrations/supabase/client";
import {
  ConflictResolution,
  ConflictResolutionFormData,
  CommonGround,
  DisagreementPoint,
  Evidence,
  ProposedSolution,
  MediationStatus
} from "@/types/conflictResolution";

/**
 * Service for managing conflict resolutions
 */
export const conflictResolutionService = {
  /**
   * Create a new conflict resolution
   */
  createConflictResolution: async (
    data: ConflictResolutionFormData
  ): Promise<ConflictResolution> => {
    try {
      // Get the current user
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("Authentication required");
      }
      
      const userId = session.user.id;
      
      // Insert the conflict resolution
      const { data: conflictResolution, error } = await supabase
        .from("conflict_resolutions")
        .insert({
          title: data.title,
          description: data.description,
          party_a: data.partyA,
          party_b: data.partyB,
          position_a: data.positionA,
          position_b: data.positionB,
          user_id: userId
        })
        .select("*")
        .single();
      
      if (error) throw error;
      
      // Format the result to match our type
      return {
        id: conflictResolution.id,
        title: conflictResolution.title,
        description: conflictResolution.description,
        partyA: conflictResolution.party_a,
        partyB: conflictResolution.party_b,
        createdAt: conflictResolution.created_at,
        updatedAt: conflictResolution.updated_at,
        createdBy: conflictResolution.user_id,
        positionA: {
          content: conflictResolution.position_a,
          author: userId,
          createdAt: conflictResolution.created_at
        },
        positionB: {
          content: conflictResolution.position_b,
          author: userId,
          createdAt: conflictResolution.created_at
        },
        progress: {
          currentStage: conflictResolution.current_stage,
          completedStages: conflictResolution.completed_stages || [],
          lastModified: conflictResolution.updated_at,
          stageProgress: conflictResolution.stage_progress || {}
        },
        consensusReached: conflictResolution.consensus_reached || false,
        isPublic: conflictResolution.is_public || true
      };
    } catch (error) {
      console.error("Error creating conflict resolution:", error);
      throw error;
    }
  },
  
  /**
   * Get a conflict resolution by ID
   */
  getConflictResolution: async (id: string): Promise<ConflictResolution> => {
    try {
      const { data: conflictResolution, error } = await supabase
        .from("conflict_resolutions")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      
      // Return the formatted conflict resolution
      return {
        id: conflictResolution.id,
        title: conflictResolution.title,
        description: conflictResolution.description,
        partyA: conflictResolution.party_a,
        partyB: conflictResolution.party_b,
        createdAt: conflictResolution.created_at,
        updatedAt: conflictResolution.updated_at,
        createdBy: conflictResolution.user_id,
        positionA: {
          content: conflictResolution.position_a,
          author: conflictResolution.user_id,
          createdAt: conflictResolution.created_at
        },
        positionB: {
          content: conflictResolution.position_b,
          author: conflictResolution.user_id,
          createdAt: conflictResolution.created_at
        },
        commonGround: conflictResolution.common_ground,
        disagreementPoints: conflictResolution.disagreement_points,
        evidenceList: conflictResolution.evidence_list,
        proposedSolutions: conflictResolution.proposed_solutions,
        mediationRequest: conflictResolution.mediation_request,
        progress: {
          currentStage: conflictResolution.current_stage,
          completedStages: conflictResolution.completed_stages || [],
          lastModified: conflictResolution.updated_at,
          stageProgress: conflictResolution.stage_progress || {}
        },
        consensusReached: conflictResolution.consensus_reached || false,
        isPublic: conflictResolution.is_public || true
      };
    } catch (error) {
      console.error("Error retrieving conflict resolution:", error);
      throw error;
    }
  },
  
  /**
   * Update common ground
   */
  updateCommonGround: async (
    conflictId: string,
    commonGroundPoints: string[]
  ): Promise<ConflictResolution> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("Authentication required");
      }
      
      const userId = session.user.id;
      
      const commonGround: CommonGround = {
        points: commonGroundPoints,
        agreedBy: [userId],
        createdAt: new Date().toISOString()
      };
      
      // Update the conflict resolution
      const { data, error } = await supabase
        .from("conflict_resolutions")
        .update({
          common_ground: commonGround,
          current_stage: "disagreement",
          completed_stages: ["articulation", "commonGround"],
          stage_progress: {
            articulation: 100,
            commonGround: 100,
            disagreement: 0,
            evidence: 0,
            solution: 0,
            consensus: 0
          }
        })
        .eq("id", conflictId)
        .select("*")
        .single();
      
      if (error) throw error;
      
      // Get the updated conflict resolution
      return await this.getConflictResolution(conflictId);
    } catch (error) {
      console.error("Error updating common ground:", error);
      throw error;
    }
  },
  
  /**
   * Update disagreement points
   */
  updateDisagreementPoints: async (
    conflictId: string,
    disagreementPoints: DisagreementPoint[]
  ): Promise<ConflictResolution> => {
    try {
      // Update the conflict resolution
      const { error } = await supabase
        .from("conflict_resolutions")
        .update({
          disagreement_points: disagreementPoints,
          current_stage: "evidence",
          completed_stages: ["articulation", "commonGround", "disagreement"],
          stage_progress: {
            articulation: 100,
            commonGround: 100,
            disagreement: 100,
            evidence: 0,
            solution: 0,
            consensus: 0
          }
        })
        .eq("id", conflictId);
      
      if (error) throw error;
      
      // Get the updated conflict resolution
      return await this.getConflictResolution(conflictId);
    } catch (error) {
      console.error("Error updating disagreement points:", error);
      throw error;
    }
  },
  
  /**
   * Add evidence
   */
  addEvidence: async (
    conflictId: string,
    evidenceList: Evidence[]
  ): Promise<ConflictResolution> => {
    try {
      // Update the conflict resolution
      const { error } = await supabase
        .from("conflict_resolutions")
        .update({
          evidence_list: evidenceList,
          current_stage: "solution",
          completed_stages: ["articulation", "commonGround", "disagreement", "evidence"],
          stage_progress: {
            articulation: 100,
            commonGround: 100,
            disagreement: 100,
            evidence: 100,
            solution: 0,
            consensus: 0
          }
        })
        .eq("id", conflictId);
      
      if (error) throw error;
      
      // Get the updated conflict resolution
      return await this.getConflictResolution(conflictId);
    } catch (error) {
      console.error("Error adding evidence:", error);
      throw error;
    }
  },
  
  /**
   * Propose solutions
   */
  proposeolutions: async (
    conflictId: string,
    proposedSolutions: ProposedSolution[]
  ): Promise<ConflictResolution> => {
    try {
      // Update the conflict resolution
      const { error } = await supabase
        .from("conflict_resolutions")
        .update({
          proposed_solutions: proposedSolutions,
          current_stage: "consensus",
          completed_stages: ["articulation", "commonGround", "disagreement", "evidence", "solution"],
          stage_progress: {
            articulation: 100,
            commonGround: 100,
            disagreement: 100,
            evidence: 100,
            solution: 100,
            consensus: 0
          }
        })
        .eq("id", conflictId);
      
      if (error) throw error;
      
      // Get the updated conflict resolution
      return await this.getConflictResolution(conflictId);
    } catch (error) {
      console.error("Error proposing solutions:", error);
      throw error;
    }
  },
  
  /**
   * Build consensus
   */
  buildConsensus: async (
    conflictId: string,
    agreedSolution: string
  ): Promise<ConflictResolution> => {
    try {
      // Update the conflict resolution
      const { error } = await supabase
        .from("conflict_resolutions")
        .update({
          consensus_reached: true,
          agreed_solution: agreedSolution,
          completed_stages: ["articulation", "commonGround", "disagreement", "evidence", "solution", "consensus"],
          stage_progress: {
            articulation: 100,
            commonGround: 100,
            disagreement: 100,
            evidence: 100,
            solution: 100,
            consensus: 100
          }
        })
        .eq("id", conflictId);
      
      if (error) throw error;
      
      // Get the updated conflict resolution
      return await this.getConflictResolution(conflictId);
    } catch (error) {
      console.error("Error building consensus:", error);
      throw error;
    }
  },
  
  /**
   * Get visualization data
   */
  getVisualizationData: async (conflictId: string) => {
    try {
      // Get the conflict resolution
      const conflictResolution = await this.getConflictResolution(conflictId);
      
      // Calculate visualization data
      const commonGroundCount = conflictResolution.commonGround?.points.length || 0;
      const disagreementCount = conflictResolution.disagreementPoints?.length || 0;
      
      // Calculate evidence distribution
      const evidenceDistribution: Record<string, number> = {};
      conflictResolution.evidenceList?.forEach(evidence => {
        evidenceDistribution[evidence.point] = (evidenceDistribution[evidence.point] || 0) + evidence.sources.length;
      });
      
      // Calculate solution endorsements
      const solutionEndorsements: Record<string, number> = {};
      conflictResolution.proposedSolutions?.forEach(solution => {
        solutionEndorsements[solution.description] = solution.endorsements?.length || 0;
      });
      
      return {
        commonGroundCount,
        disagreementCount,
        evidenceDistribution,
        solutionEndorsements
      };
    } catch (error) {
      console.error("Error getting visualization data:", error);
      throw error;
    }
  },
  
  /**
   * Request mediation
   */
  requestMediation: async (conflictId: string, reason: string): Promise<ConflictResolution> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        throw new Error("Authentication required");
      }
      
      const userId = session.user.id;
      
      const mediationRequest = {
        requestedBy: userId,
        requestedAt: new Date().toISOString(),
        reason: reason,
        status: MediationStatus.REQUESTED
      };
      
      // Update the conflict resolution
      const { error } = await supabase
        .from("conflict_resolutions")
        .update({
          mediation_request: mediationRequest
        })
        .eq("id", conflictId);
      
      if (error) throw error;
      
      // Get the updated conflict resolution
      return await this.getConflictResolution(conflictId);
    } catch (error) {
      console.error("Error requesting mediation:", error);
      throw error;
    }
  },
  
  /**
   * Assign mediator
   */
  assignMediator: async (conflictId: string, mediatorId: string): Promise<ConflictResolution> => {
    try {
      // Get the current conflict resolution
      const conflictResolution = await this.getConflictResolution(conflictId);
      
      if (!conflictResolution.mediationRequest) {
        throw new Error("No mediation request exists for this conflict");
      }
      
      const updatedMediationRequest = {
        ...conflictResolution.mediationRequest,
        assignedMediatorId: mediatorId,
        status: MediationStatus.IN_PROGRESS
      };
      
      // Update the conflict resolution
      const { error } = await supabase
        .from("conflict_resolutions")
        .update({
          mediation_request: updatedMediationRequest
        })
        .eq("id", conflictId);
      
      if (error) throw error;
      
      // Get the updated conflict resolution
      return await this.getConflictResolution(conflictId);
    } catch (error) {
      console.error("Error assigning mediator:", error);
      throw error;
    }
  },
  
  /**
   * Get progress history
   */
  getProgressHistory: async (conflictId: string) => {
    try {
      // Get the conflict resolution history
      const { data, error } = await supabase
        .from("conflict_resolution_history")
        .select("*")
        .eq("conflict_id", conflictId)
        .order("completed_at", { ascending: true });
      
      if (error) throw error;
      
      // Format the history
      return data.map(entry => ({
        stage: entry.stage,
        completedAt: entry.completed_at,
        durationDays: entry.duration_days
      }));
    } catch (error) {
      console.error("Error getting progress history:", error);
      throw error;
    }
  }
};
