
import { supabase } from "@/integrations/supabase/client";

export type ProposalPhase = "presentation" | "discussion" | "voting" | "completed";

// Function to calculate vote weight based on user metrics
export const calculateVoteWeight = async (userId: string): Promise<number> => {
  try {
    // This is where we would query Supabase for user metrics
    // For now, return a mock value between 1.0 and 3.0
    return 1.5;
  } catch (error) {
    console.error("Error calculating vote weight:", error);
    return 1.0; // Base weight as fallback
  }
};

// Function to check if a user can create a proposal
export const canCreateProposal = async (userId: string): Promise<{allowed: boolean; reason?: string}> => {
  try {
    // Check account age (14 days minimum)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('join_date')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    const accountAge = Date.now() - new Date(profile.join_date).getTime();
    const minimumAge = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
    
    if (accountAge < minimumAge) {
      return {
        allowed: false,
        reason: "Your account must be at least 14 days old to create proposals"
      };
    }
    
    // Check proposal count in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // This would be replaced with actual Supabase query for proposals
    // For now, just return allowed: true
    
    return { allowed: true };
  } catch (error) {
    console.error("Error checking proposal eligibility:", error);
    return { allowed: false, reason: "Error checking eligibility" };
  }
};

// Function to advance proposal phase automatically
export const advanceProposalPhase = async (proposalId: string): Promise<void> => {
  try {
    // This function would be called by a cron job or similar to advance phases
    // It would update the proposal's phase and timestamps in Supabase
    
    // Get current proposal phase
    // Update to next phase
    // Set new phase end time
    
    console.log(`Advanced phase for proposal ${proposalId}`);
  } catch (error) {
    console.error("Error advancing proposal phase:", error);
  }
};

// Function to check for suspicious voting patterns
export const checkForSuspiciousActivity = async (proposalId: string, userId: string, ipAddress: string): Promise<boolean> => {
  // This function would check for multiple votes from same IP, rapid voting patterns, etc.
  // Returns true if activity seems suspicious
  
  return false; // For now, always return false
};

// Function to format remaining time in human-readable format
export const formatTimeRemaining = (endTime: string): string => {
  const end = new Date(endTime);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  
  if (diff <= 0) return "Phase ended";
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 24) {
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  } else {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h remaining`;
  }
};
