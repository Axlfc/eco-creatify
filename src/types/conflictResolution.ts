
/**
 * Types for the conflict resolution system
 */

export enum Stage {
  Articulation = "articulation",
  CommonGround = "commonGround",
  Disagreement = "disagreement",
  Evidence = "evidence",
  Solution = "solution",
  Consensus = "consensus"
}

export enum ConflictStage {
  ARTICULATION = "articulation",
  COMMON_GROUND = "commonGround",
  DISAGREEMENT = "disagreement",
  EVIDENCE = "evidence",
  SOLUTION = "solution",
  CONSENSUS = "consensus"
}

export enum MediationStatus {
  NOT_REQUESTED = "notRequested",
  REQUESTED = "requested",
  IN_PROGRESS = "inProgress",
  COMPLETED = "completed",
  REJECTED = "rejected"
}

export interface ConflictPosition {
  content: string;
  createdBy?: string;
}

export interface Position {
  content: string;
  evidence?: string[];
  author: string;
  createdAt: string;
}

export interface CommonGround {
  points: string[];
  agreedBy: string[];
  createdAt: string;
}

export interface DisagreementPoint {
  description: string;
  positionA: string;
  positionB: string;
  createdAt: string;
}

export interface Evidence {
  point: string;
  sources: string[];
  attachments?: string[];
  submittedBy: string;
  createdAt: string;
}

export interface ProposedSolution {
  description: string;
  addressesPoints: string[];
  proposedBy: string;
  createdAt: string;
  endorsements?: string[];
}

export interface MediationRequest {
  requestedBy: string;
  requestedAt: string;
  reason: string;
  status: MediationStatus;
  assignedMediatorId?: string;
  completedAt?: string;
}

export interface ConflictResolutionProgress {
  current_stage: Stage;
  completed_stages: Stage[];
  stage_progress: Record<string, number>; // 0-100 percentage
}

export interface ConflictResolution {
  id: string;
  title: string;
  description?: string;
  partyA: string;
  partyB: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  positionA: ConflictPosition;
  positionB: ConflictPosition;
  progress: ConflictResolutionProgress;
  commonGround?: CommonGround;
  disagreementPoints?: DisagreementPoint[];
  evidenceList?: Evidence[];
  proposedSolutions?: ProposedSolution[];
  mediationRequest?: MediationRequest;
  consensusReached: boolean;
  isPublic: boolean;
}

export interface ConflictResolutionFormData {
  title: string;
  description?: string;
  partyA: string;
  partyB: string;
  positionA: string;
  positionB: string;
  commonGround?: string;
  proposedSolution?: string;
}
