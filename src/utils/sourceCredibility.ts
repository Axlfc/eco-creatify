
import { Source, SourceType } from "@/components/FactCheckCard";

export type CredibilityMetric = "accuracy" | "transparency" | "citations" | "longevity" | "expertise";

export interface SourceCredibilityScore {
  sourceId: string;
  overallScore: number; // 0-100
  metrics: {
    accuracy: number; // 0-100
    transparency: number; // 0-100
    citations: number; // 0-100
    longevity: number; // 0-100
    expertise: number; // 0-100
  };
  lastUpdated: string;
}

export interface SourceWithCredibility extends Source {
  credibilityScore?: SourceCredibilityScore;
}

// Base scores by source type - these would normally come from a database
const baseCredibilityByType: Record<SourceType, number> = {
  "academic": 80,
  "government": 75,
  "news": 65,
  "organization": 60,
  "primary": 85
};

// Sample accuracy history data - in a real app, this would come from a database
const accuracyHistory: Record<string, { correct: number; total: number }> = {
  // Sample IDs - these would match real source IDs in your application
  "s-001": { correct: 95, total: 100 },
  "s-002": { correct: 85, total: 100 },
  "s-003": { correct: 72, total: 100 },
  // Default for sources without history
  "default": { correct: 70, total: 100 }
};

/**
 * Calculate accuracy score based on historical fact checks
 */
const calculateAccuracyScore = (sourceId: string): number => {
  const history = accuracyHistory[sourceId] || accuracyHistory.default;
  return Math.round((history.correct / history.total) * 100);
};

/**
 * Calculate transparency score based on source type and available metadata
 */
const calculateTransparencyScore = (source: Source): number => {
  let score = 50; // Base score
  
  // Add points for available metadata
  if (source.author) score += 15;
  if (source.date) score += 10;
  if (source.publishedBy) score += 15;
  if (source.url.includes("https")) score += 10; // HTTPS is more trustworthy
  
  // Academic and government sources typically have better transparency
  if (source.type === "academic" || source.type === "government") {
    score += 10;
  }
  
  return Math.min(score, 100); // Cap at 100
};

/**
 * Calculate citation score based on presence of citations and reference quality
 * In a real app, you would analyze the actual citations in the content
 */
const calculateCitationScore = (source: Source): number => {
  // This is a simplified version - a real implementation would analyze
  // the actual citation practices within the source
  switch (source.type) {
    case "academic": return 90;
    case "government": return 85;
    case "news": return 65;
    case "organization": return 70;
    case "primary": return 75;
    default: return 60;
  }
};

/**
 * Calculate longevity score based on source age
 */
const calculateLongevityScore = (source: Source): number => {
  if (!source.date) return 50; // Default if no date
  
  const publicationDate = new Date(source.date);
  const now = new Date();
  const ageInYears = (now.getTime() - publicationDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  
  // Sources that have been around longer may be more established
  // But very old sources might be outdated for certain topics
  if (ageInYears < 0) return 50; // Future date, suspicious
  if (ageInYears < 1) return 65; // New sources are less established
  if (ageInYears < 5) return 80; // Established sources
  if (ageInYears < 10) return 90; // Well-established sources
  if (ageInYears < 20) return 85; // Older but still relevant
  return 70; // Very old sources might be less relevant for certain topics
};

/**
 * Calculate expertise score based on source type and publisher
 */
const calculateExpertiseScore = (source: Source): number => {
  let score = baseCredibilityByType[source.type];
  
  // Add domain-specific expertise factors here
  // This would be more sophisticated in a real application
  if (source.publishedBy) {
    if (source.publishedBy.includes("University") || 
        source.publishedBy.includes("Institute")) {
      score += 10;
    }
  }
  
  return Math.min(score, 100); // Cap at 100
};

/**
 * Calculate the overall credibility score based on individual metrics
 */
const calculateOverallScore = (metrics: SourceCredibilityScore["metrics"]): number => {
  // Weighted average of all metrics
  const weights = {
    accuracy: 0.35,
    transparency: 0.20,
    citations: 0.20,
    longevity: 0.10,
    expertise: 0.15
  };
  
  const weightedScore = 
    metrics.accuracy * weights.accuracy +
    metrics.transparency * weights.transparency +
    metrics.citations * weights.citations +
    metrics.longevity * weights.longevity +
    metrics.expertise * weights.expertise;
  
  return Math.round(weightedScore);
};

/**
 * Score a source based on all credibility metrics
 */
export const scoreSourceCredibility = (source: Source): SourceCredibilityScore => {
  const metrics = {
    accuracy: calculateAccuracyScore(source.id),
    transparency: calculateTransparencyScore(source),
    citations: calculateCitationScore(source),
    longevity: calculateLongevityScore(source),
    expertise: calculateExpertiseScore(source)
  };
  
  return {
    sourceId: source.id,
    metrics,
    overallScore: calculateOverallScore(metrics),
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Classify the credibility level based on score
 */
export const getCredibilityLevel = (score: number): string => {
  if (score >= 90) return "Very High";
  if (score >= 80) return "High";
  if (score >= 70) return "Good";
  if (score >= 60) return "Moderate";
  if (score >= 50) return "Fair";
  if (score >= 40) return "Low";
  return "Very Low";
};

/**
 * Get the CSS color class based on credibility score
 */
export const getCredibilityColor = (score: number): string => {
  if (score >= 85) return "text-green-600";
  if (score >= 70) return "text-green-500";
  if (score >= 60) return "text-amber-500";
  if (score >= 50) return "text-amber-400";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
};

/**
 * Enhance sources with credibility scores
 */
export const enhanceSourcesWithCredibility = (sources: Source[]): SourceWithCredibility[] => {
  return sources.map(source => ({
    ...source,
    credibilityScore: scoreSourceCredibility(source)
  }));
};
