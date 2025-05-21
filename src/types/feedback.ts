
export type FeedbackCategory = "Process" | "Outcome" | "Representation" | "Implementation";

export interface FeedbackMetric {
  id: string;
  name: string;
  description: string;
  category: FeedbackCategory;
}

export interface DecisionFeedback {
  id: string;
  decision_id: string;
  user_id: string;
  ratings: Record<string, number>;
  lessons_learned: string;
  suggested_adjustments: string;
  demographic_group: string;
  created_at: string;
}

export interface PastDecision {
  id: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  status: "implemented" | "in-progress" | "planned";
  feedbackCount: number;
}

export interface FeedbackStatistic {
  metric_id: string;
  metric_name: string;
  category: FeedbackCategory;
  average_rating: number;
  total_responses: number;
}

export interface DemographicParticipation {
  group: string;
  count: number;
  percentage: number;
}
