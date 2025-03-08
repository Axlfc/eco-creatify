
import { supabase } from "@/integrations/supabase/client";
import { ConflictResolution, ConflictResolutionFormData, ConflictStage } from "@/types/conflictResolution";

const TEST_PREFIX = "TEST_E2E_";

/**
 * Creates a test user session for conflict resolution testing
 */
export const createTestUserSession = async (): Promise<string> => {
  // Mock user authentication for testing
  const mockUser = { id: "test-user-id-" + Date.now().toString() };
  
  // Mock the auth session
  (supabase.auth.getSession as jest.Mock).mockResolvedValue({
    data: {
      session: {
        user: mockUser
      }
    }
  });
  
  return mockUser.id;
};

/**
 * Creates a test conflict resolution
 */
export const createTestConflictResolution = async (
  userId: string,
  data: Partial<ConflictResolutionFormData> = {}
): Promise<ConflictResolution> => {
  const defaultData: ConflictResolutionFormData = {
    title: `${TEST_PREFIX}Test Conflict Resolution`,
    description: "This is a test conflict resolution",
    partyA: "Environmental Advocates",
    partyB: "Industry Representatives",
    positionA: "We believe that stricter environmental regulations are necessary to protect natural resources and combat climate change. The current policies aren't sufficient to address the urgent environmental challenges we face.",
    positionB: "We believe that current regulations are already too restrictive and harm economic growth. Additional regulations would place an undue burden on businesses and lead to job losses.",
    commonGround: "Both parties want a sustainable future with a healthy environment and a strong economy. We agree that evidence-based policies are important.",
    proposedSolution: "A phased approach to implementing new regulations with economic impact assessments at each stage. Create a joint committee with representatives from both sides to oversee implementation."
  };

  const formData = { ...defaultData, ...data };
  
  // Mock the database insert operation
  const mockResolution: ConflictResolution = {
    id: "test-conflict-" + Date.now().toString(),
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    consensusReached: false,
    isPublic: true,
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
    partyA: formData.partyA,
    partyB: formData.partyB,
    positionA: {
      content: formData.positionA,
      author: userId,
      createdAt: new Date().toISOString()
    },
    positionB: {
      content: formData.positionB,
      author: userId,
      createdAt: new Date().toISOString()
    },
    title: formData.title,
    description: formData.description
  };

  (supabase.from as jest.Mock).mockReturnValue({
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockResolvedValue({
      data: mockResolution,
      error: null
    })
  });

  return mockResolution;
};

/**
 * Updates a test conflict resolution
 */
export const updateTestConflictResolution = async (
  conflictId: string,
  update: Partial<ConflictResolution>
): Promise<ConflictResolution> => {
  const mockUpdatedResolution = {
    ...update,
    id: conflictId,
    updatedAt: new Date().toISOString()
  };

  (supabase.from as jest.Mock).mockReturnValue({
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    select: jest.fn().mockResolvedValue({
      data: mockUpdatedResolution,
      error: null
    })
  });

  return mockUpdatedResolution as ConflictResolution;
};

/**
 * Cleans up test conflict resolutions
 */
export const cleanupTestConflictResolutions = async (prefix = TEST_PREFIX): Promise<void> => {
  (supabase.from as jest.Mock).mockReturnValue({
    delete: jest.fn().mockReturnThis(),
    like: jest.fn().mockResolvedValue({
      data: null,
      error: null
    })
  });
};

/**
 * Creates test fixtures for different conflict types
 */
export const createConflictFixtures = () => {
  return {
    environmentalConflict: {
      title: `${TEST_PREFIX}Environmental Resource Dispute`,
      description: "Conflict over land use for conservation vs. development",
      partyA: "Conservation Group", 
      partyB: "Development Company",
      positionA: "The land should be preserved as a natural habitat for endangered species and as a carbon sink to combat climate change. Development would destroy critical ecosystems that cannot be replaced.",
      positionB: "The land should be developed to provide housing and economic opportunities. Modern building practices can minimize environmental impact while meeting human needs for shelter and jobs."
    },
    
    policyConflict: {
      title: `${TEST_PREFIX}Education Policy Dispute`,
      description: "Disagreement over standardized testing in schools",
      partyA: "Teachers Union", 
      partyB: "Education Reform Group",
      positionA: "Standardized testing narrows the curriculum, creates unhealthy pressure on students, and doesn't accurately measure meaningful learning or teacher effectiveness.",
      positionB: "Standardized testing provides objective measures of student achievement, enables identification of struggling schools, and ensures accountability for educational outcomes."
    },
    
    communityConflict: {
      title: `${TEST_PREFIX}Community Resource Allocation`,
      description: "Dispute over municipal budget priorities",
      partyA: "Community Services Advocates", 
      partyB: "Infrastructure Improvement Committee",
      positionA: "The municipal budget should prioritize social services, recreation facilities, and community programs to support vulnerable populations and improve quality of life.",
      positionB: "The municipal budget should focus on critical infrastructure repairs, transportation improvements, and public safety to ensure a functioning city for all residents."
    }
  };
};
