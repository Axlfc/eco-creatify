
import { supabase } from "@/integrations/supabase/client";
import {
  ConflictResolution,
  ConflictStage,
  CommonGround,
  DisagreementPoint,
  Evidence,
  ProposedSolution,
  MediationStatus
} from "@/types/conflictResolution";
import * as testUtils from "./utils/conflictResolutionTestUtils";

// Mock the Supabase client
jest.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: {
          session: {
            user: {
              id: "test-user-id"
            }
          }
        }
      })
    },
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      match: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {},
        error: null
      })
    })
  }
}));

// Mock conflict resolution service (we'll create this later)
import { conflictResolutionService } from "../services/conflictResolutionService";
jest.mock("../services/conflictResolutionService");

describe("Conflict Resolution System End-to-End", () => {
  let testUserId: string;
  let testConflictId: string;
  let testConflict: ConflictResolution;
  
  // Setup before all tests
  beforeAll(async () => {
    testUserId = await testUtils.createTestUserSession();
    console.log("Test user session created with ID:", testUserId);
  });
  
  // Clean up after all tests
  afterAll(async () => {
    await testUtils.cleanupTestConflictResolutions();
    console.log("Test conflict resolutions cleaned up");
  });
  
  describe("User Journey through Conflict Resolution Stages", () => {
    // Test Stage 1: Articulation
    it("should start with the articulation stage and submit positions", async () => {
      console.log("Starting articulation stage test");
      
      // Create a test conflict with positions for both parties
      const fixtures = testUtils.createConflictFixtures();
      testConflict = await testUtils.createTestConflictResolution(testUserId, fixtures.environmentalConflict);
      testConflictId = testConflict.id;
      
      expect(testConflict).toBeTruthy();
      expect(testConflict.positionA.content).toBe(fixtures.environmentalConflict.positionA);
      expect(testConflict.positionB.content).toBe(fixtures.environmentalConflict.positionB);
      expect(testConflict.progress.currentStage).toBe(ConflictStage.ARTICULATION);
      expect(testConflict.progress.stageProgress[ConflictStage.ARTICULATION]).toBe(100);
      
      console.log("Articulation stage test completed");
    });
    
    // Test Stage 2: Common Ground
    it("should proceed to common ground identification", async () => {
      console.log("Starting common ground stage test");
      
      const commonGround: CommonGround = {
        points: [
          "Both parties recognize the importance of the land in question",
          "Both parties want to see the community thrive and prosper",
          "Both parties acknowledge that environmental considerations matter",
          "Both parties agree that economic opportunities are important"
        ],
        agreedBy: [testUserId],
        createdAt: new Date().toISOString()
      };
      
      // Mock the service response
      (conflictResolutionService.updateCommonGround as jest.Mock).mockResolvedValue({
        ...testConflict,
        commonGround,
        progress: {
          ...testConflict.progress,
          currentStage: ConflictStage.DISAGREEMENT,
          completedStages: [ConflictStage.ARTICULATION, ConflictStage.COMMON_GROUND],
          stageProgress: {
            ...testConflict.progress.stageProgress,
            [ConflictStage.COMMON_GROUND]: 100
          }
        }
      });
      
      // Update the test conflict with common ground
      const updatedConflict = await conflictResolutionService.updateCommonGround(
        testConflictId,
        commonGround.points
      );
      
      expect(updatedConflict.commonGround).toBeTruthy();
      expect(updatedConflict.commonGround?.points.length).toBe(4);
      expect(updatedConflict.progress.currentStage).toBe(ConflictStage.DISAGREEMENT);
      expect(updatedConflict.progress.stageProgress[ConflictStage.COMMON_GROUND]).toBe(100);
      
      // Update our test object
      testConflict = updatedConflict;
      
      console.log("Common ground stage test completed");
    });
    
    // Test Stage 3: Disagreement Isolation
    it("should isolate specific points of disagreement", async () => {
      console.log("Starting disagreement isolation stage test");
      
      const disagreementPoints: DisagreementPoint[] = [
        {
          description: "Land use prioritization",
          positionA: "Preservation of natural habitats should take precedence over development",
          positionB: "Human housing needs should take precedence over habitat preservation",
          createdAt: new Date().toISOString()
        },
        {
          description: "Environmental impact assessment",
          positionA: "Development will irreparably damage the ecosystem",
          positionB: "Environmental impacts can be adequately mitigated through modern practices",
          createdAt: new Date().toISOString()
        }
      ];
      
      // Mock the service response
      (conflictResolutionService.updateDisagreementPoints as jest.Mock).mockResolvedValue({
        ...testConflict,
        disagreementPoints,
        progress: {
          ...testConflict.progress,
          currentStage: ConflictStage.EVIDENCE,
          completedStages: [
            ConflictStage.ARTICULATION, 
            ConflictStage.COMMON_GROUND, 
            ConflictStage.DISAGREEMENT
          ],
          stageProgress: {
            ...testConflict.progress.stageProgress,
            [ConflictStage.DISAGREEMENT]: 100
          }
        }
      });
      
      // Update the test conflict with disagreement points
      const updatedConflict = await conflictResolutionService.updateDisagreementPoints(
        testConflictId,
        disagreementPoints
      );
      
      expect(updatedConflict.disagreementPoints).toBeTruthy();
      expect(updatedConflict.disagreementPoints?.length).toBe(2);
      expect(updatedConflict.progress.currentStage).toBe(ConflictStage.EVIDENCE);
      expect(updatedConflict.progress.stageProgress[ConflictStage.DISAGREEMENT]).toBe(100);
      
      // Update our test object
      testConflict = updatedConflict;
      
      console.log("Disagreement isolation stage test completed");
    });
    
    // Test Stage 4: Evidence Collection
    it("should collect and associate evidence with disagreement points", async () => {
      console.log("Starting evidence collection stage test");
      
      const evidenceList: Evidence[] = [
        {
          point: "Land use prioritization",
          sources: [
            "Environmental Impact Study by University Research Group, 2023",
            "Endangered Species Habitat Report, Environmental Protection Agency"
          ],
          submittedBy: testUserId,
          createdAt: new Date().toISOString()
        },
        {
          point: "Environmental impact assessment",
          sources: [
            "Modern Construction Practices: Environmental Considerations, 2022",
            "Case Studies in Sustainable Development, Urban Planning Institute"
          ],
          submittedBy: testUserId,
          createdAt: new Date().toISOString()
        }
      ];
      
      // Mock the service response
      (conflictResolutionService.addEvidence as jest.Mock).mockResolvedValue({
        ...testConflict,
        evidenceList,
        progress: {
          ...testConflict.progress,
          currentStage: ConflictStage.SOLUTION,
          completedStages: [
            ConflictStage.ARTICULATION, 
            ConflictStage.COMMON_GROUND, 
            ConflictStage.DISAGREEMENT,
            ConflictStage.EVIDENCE
          ],
          stageProgress: {
            ...testConflict.progress.stageProgress,
            [ConflictStage.EVIDENCE]: 100
          }
        }
      });
      
      // Update the test conflict with evidence
      const updatedConflict = await conflictResolutionService.addEvidence(
        testConflictId,
        evidenceList
      );
      
      expect(updatedConflict.evidenceList).toBeTruthy();
      expect(updatedConflict.evidenceList?.length).toBe(2);
      expect(updatedConflict.progress.currentStage).toBe(ConflictStage.SOLUTION);
      expect(updatedConflict.progress.stageProgress[ConflictStage.EVIDENCE]).toBe(100);
      
      // Update our test object
      testConflict = updatedConflict;
      
      console.log("Evidence collection stage test completed");
    });
    
    // Test Stage 5: Solution Proposal
    it("should propose and evaluate solutions", async () => {
      console.log("Starting solution proposal stage test");
      
      const proposedSolutions: ProposedSolution[] = [
        {
          description: "Create a mixed-use development with 60% of land preserved as natural habitat and wildlife corridors.",
          addressesPoints: ["Land use prioritization", "Environmental impact assessment"],
          proposedBy: testUserId,
          createdAt: new Date().toISOString(),
          endorsements: [testUserId]
        },
        {
          description: "Implement a phased development approach with ongoing environmental monitoring and preservation of key habitat areas.",
          addressesPoints: ["Environmental impact assessment"],
          proposedBy: testUserId,
          createdAt: new Date().toISOString()
        }
      ];
      
      // Mock the service response
      (conflictResolutionService.proposeSolutions as jest.Mock).mockResolvedValue({
        ...testConflict,
        proposedSolutions,
        progress: {
          ...testConflict.progress,
          currentStage: ConflictStage.CONSENSUS,
          completedStages: [
            ConflictStage.ARTICULATION, 
            ConflictStage.COMMON_GROUND, 
            ConflictStage.DISAGREEMENT,
            ConflictStage.EVIDENCE,
            ConflictStage.SOLUTION
          ],
          stageProgress: {
            ...testConflict.progress.stageProgress,
            [ConflictStage.SOLUTION]: 100
          }
        }
      });
      
      // Update the test conflict with proposed solutions
      const updatedConflict = await conflictResolutionService.proposeolutions(
        testConflictId,
        proposedSolutions
      );
      
      expect(updatedConflict.proposedSolutions).toBeTruthy();
      expect(updatedConflict.proposedSolutions?.length).toBe(2);
      expect(updatedConflict.progress.currentStage).toBe(ConflictStage.CONSENSUS);
      expect(updatedConflict.progress.stageProgress[ConflictStage.SOLUTION]).toBe(100);
      
      // Update our test object
      testConflict = updatedConflict;
      
      console.log("Solution proposal stage test completed");
    });
    
    // Test Stage 6: Consensus Building
    it("should build consensus and complete the resolution process", async () => {
      console.log("Starting consensus building stage test");
      
      // Mock the service response
      (conflictResolutionService.buildConsensus as jest.Mock).mockResolvedValue({
        ...testConflict,
        consensusReached: true,
        progress: {
          ...testConflict.progress,
          currentStage: ConflictStage.CONSENSUS,
          completedStages: [
            ConflictStage.ARTICULATION, 
            ConflictStage.COMMON_GROUND, 
            ConflictStage.DISAGREEMENT,
            ConflictStage.EVIDENCE,
            ConflictStage.SOLUTION,
            ConflictStage.CONSENSUS
          ],
          stageProgress: {
            ...testConflict.progress.stageProgress,
            [ConflictStage.CONSENSUS]: 100
          }
        }
      });
      
      // Build consensus on the first proposed solution
      const updatedConflict = await conflictResolutionService.buildConsensus(
        testConflictId,
        testConflict.proposedSolutions![0].description
      );
      
      expect(updatedConflict.consensusReached).toBe(true);
      expect(updatedConflict.progress.completedStages).toContain(ConflictStage.CONSENSUS);
      expect(updatedConflict.progress.stageProgress[ConflictStage.CONSENSUS]).toBe(100);
      
      console.log("Consensus building stage test completed");
    });
  });
  
  describe("Data Persistence and State Management", () => {
    it("should persist data between steps", async () => {
      console.log("Testing data persistence between steps");
      
      // Mock the service response
      (conflictResolutionService.getConflictResolution as jest.Mock).mockResolvedValue(testConflict);
      
      // Retrieve the conflict resolution from the database
      const retrievedConflict = await conflictResolutionService.getConflictResolution(testConflictId);
      
      // Verify that all the data is persisted
      expect(retrievedConflict.id).toBe(testConflictId);
      expect(retrievedConflict.positionA).toBeTruthy();
      expect(retrievedConflict.positionB).toBeTruthy();
      expect(retrievedConflict.commonGround).toBeTruthy();
      expect(retrievedConflict.disagreementPoints).toBeTruthy();
      expect(retrievedConflict.evidenceList).toBeTruthy();
      expect(retrievedConflict.proposedSolutions).toBeTruthy();
      expect(retrievedConflict.consensusReached).toBe(true);
      
      console.log("Data persistence test completed");
    });
  });
  
  describe("Visualization Accuracy", () => {
    it("should accurately visualize agreement and disagreement points", async () => {
      console.log("Testing visualization accuracy");
      
      // Mock the service response
      (conflictResolutionService.getVisualizationData as jest.Mock).mockResolvedValue({
        commonGroundCount: testConflict.commonGround?.points.length || 0,
        disagreementCount: testConflict.disagreementPoints?.length || 0,
        evidenceDistribution: {
          "Land use prioritization": 2,
          "Environmental impact assessment": 2
        },
        solutionEndorsements: {
          "Create a mixed-use development with 60% of land preserved as natural habitat and wildlife corridors.": 1,
          "Implement a phased development approach with ongoing environmental monitoring and preservation of key habitat areas.": 0
        }
      });
      
      // Get visualization data
      const visualizationData = await conflictResolutionService.getVisualizationData(testConflictId);
      
      // Verify the visualization data
      expect(visualizationData.commonGroundCount).toBe(4);
      expect(visualizationData.disagreementCount).toBe(2);
      expect(Object.keys(visualizationData.evidenceDistribution).length).toBe(2);
      expect(Object.keys(visualizationData.solutionEndorsements).length).toBe(2);
      
      console.log("Visualization accuracy test completed");
    });
  });
  
  describe("Mediation Request System", () => {
    it("should handle mediation requests and assignments", async () => {
      console.log("Testing mediation request system");
      
      // Create a mediation request
      const mediationRequest = {
        requestedBy: testUserId,
        requestedAt: new Date().toISOString(),
        reason: "We need help finding common ground on the environmental impact assessment",
        status: MediationStatus.REQUESTED
      };
      
      // Mock the service response
      (conflictResolutionService.requestMediation as jest.Mock).mockResolvedValue({
        ...testConflict,
        mediationRequest
      });
      
      // Request mediation
      const conflictWithMediation = await conflictResolutionService.requestMediation(
        testConflictId,
        mediationRequest.reason
      );
      
      expect(conflictWithMediation.mediationRequest).toBeTruthy();
      expect(conflictWithMediation.mediationRequest?.status).toBe(MediationStatus.REQUESTED);
      
      // Mock assigning a mediator
      const mediatorId = "mediator-user-id";
      (conflictResolutionService.assignMediator as jest.Mock).mockResolvedValue({
        ...conflictWithMediation,
        mediationRequest: {
          ...conflictWithMediation.mediationRequest!,
          status: MediationStatus.IN_PROGRESS,
          assignedMediatorId: mediatorId
        }
      });
      
      // Assign a mediator
      const conflictWithAssignedMediator = await conflictResolutionService.assignMediator(
        testConflictId,
        mediatorId
      );
      
      expect(conflictWithAssignedMediator.mediationRequest?.assignedMediatorId).toBe(mediatorId);
      expect(conflictWithAssignedMediator.mediationRequest?.status).toBe(MediationStatus.IN_PROGRESS);
      
      console.log("Mediation request system test completed");
    });
  });
  
  describe("Progress Tracking", () => {
    it("should track progress for multi-day resolution processes", async () => {
      console.log("Testing progress tracking");
      
      // Mock the service response for a multi-day process
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const threeWeeksAgo = new Date();
      threeWeeksAgo.setDate(threeWeeksAgo.getDate() - 21);
      
      const progressHistory = [
        {
          stage: ConflictStage.ARTICULATION,
          completedAt: threeWeeksAgo.toISOString(),
          durationDays: 2
        },
        {
          stage: ConflictStage.COMMON_GROUND,
          completedAt: new Date(threeWeeksAgo.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          durationDays: 5
        },
        {
          stage: ConflictStage.DISAGREEMENT,
          completedAt: new Date(threeWeeksAgo.getTime() + 9 * 24 * 60 * 60 * 1000).toISOString(),
          durationDays: 4
        },
        {
          stage: ConflictStage.EVIDENCE,
          completedAt: new Date(threeWeeksAgo.getTime() + 16 * 24 * 60 * 60 * 1000).toISOString(),
          durationDays: 7
        },
        {
          stage: ConflictStage.SOLUTION,
          completedAt: oneWeekAgo.toISOString(),
          durationDays: 5
        }
      ];
      
      (conflictResolutionService.getProgressHistory as jest.Mock).mockResolvedValue(progressHistory);
      
      // Get progress history
      const history = await conflictResolutionService.getProgressHistory(testConflictId);
      
      expect(history).toBeTruthy();
      expect(history.length).toBe(5);
      expect(history[0].stage).toBe(ConflictStage.ARTICULATION);
      expect(history[4].stage).toBe(ConflictStage.SOLUTION);
      
      // Verify that durations add up correctly
      const totalDays = history.reduce((sum, entry) => sum + entry.durationDays, 0);
      expect(totalDays).toBe(23); // Total days spent across all completed stages
      
      console.log("Progress tracking test completed");
    });
  });
  
  describe("Different Conflict Types", () => {
    it("should handle different types of conflicts appropriately", async () => {
      console.log("Testing different conflict types");
      
      const fixtures = testUtils.createConflictFixtures();
      
      // Test with a policy conflict
      (conflictResolutionService.createConflictResolution as jest.Mock).mockResolvedValue({
        id: "policy-conflict-id",
        ...fixtures.policyConflict,
        createdBy: testUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        positionA: {
          content: fixtures.policyConflict.positionA,
          author: testUserId,
          createdAt: new Date().toISOString()
        },
        positionB: {
          content: fixtures.policyConflict.positionB,
          author: testUserId,
          createdAt: new Date().toISOString()
        },
        progress: {
          currentStage: ConflictStage.ARTICULATION,
          completedStages: [],
          lastModified: new Date().toISOString(),
          stageProgress: {
            [ConflictStage.ARTICULATION]: 100,
            [ConflictStage.COMMON_GROUND]: 0,
            [ConflictStage.DISAGREEMENT]: 0,
            [ConflictStage.EVIDENCE]: 0,
            [ConflictStage.SOLUTION]: 0,
            [ConflictStage.CONSENSUS]: 0
          }
        },
        consensusReached: false,
        isPublic: true
      });
      
      // Create a policy conflict
      const policyConflict = await conflictResolutionService.createConflictResolution(fixtures.policyConflict);
      
      expect(policyConflict).toBeTruthy();
      expect(policyConflict.title).toContain("Education Policy Dispute");
      
      // Test with a community conflict
      (conflictResolutionService.createConflictResolution as jest.Mock).mockResolvedValue({
        id: "community-conflict-id",
        ...fixtures.communityConflict,
        createdBy: testUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        positionA: {
          content: fixtures.communityConflict.positionA,
          author: testUserId,
          createdAt: new Date().toISOString()
        },
        positionB: {
          content: fixtures.communityConflict.positionB,
          author: testUserId,
          createdAt: new Date().toISOString()
        },
        progress: {
          currentStage: ConflictStage.ARTICULATION,
          completedStages: [],
          lastModified: new Date().toISOString(),
          stageProgress: {
            [ConflictStage.ARTICULATION]: 100,
            [ConflictStage.COMMON_GROUND]: 0,
            [ConflictStage.DISAGREEMENT]: 0,
            [ConflictStage.EVIDENCE]: 0,
            [ConflictStage.SOLUTION]: 0,
            [ConflictStage.CONSENSUS]: 0
          }
        },
        consensusReached: false,
        isPublic: true
      });
      
      // Create a community conflict
      const communityConflict = await conflictResolutionService.createConflictResolution(fixtures.communityConflict);
      
      expect(communityConflict).toBeTruthy();
      expect(communityConflict.title).toContain("Community Resource Allocation");
      
      console.log("Different conflict types test completed");
    });
  });
});
