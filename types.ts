
export enum ActivityCategory {
  WORK = 'Work',
  HEALTH = 'Health & Fitness',
  LEISURE = 'Leisure',
  EDUCATION = 'Education',
  CHORES = 'Chores',
  SLEEP = 'Sleep',
  OTHER = 'Other'
}

export enum GoalType {
  BOOK = 'Book',
  COURSE = 'Course'
}

export interface Activity {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  category: ActivityCategory;
  description?: string;
  goalId?: string; // Link to a long-term goal
}

export interface LongTermGoal {
  id: string;
  title: string;
  type: GoalType;
  creator: string; // Author or Platform
  estimatedTotalHours: number;
  completedHours: number;
  targetDate: string;
  dailyRequirementMinutes: number;
}

export interface OptimizationSuggestion {
  title: string;
  impact: 'High' | 'Medium' | 'Low';
  suggestion: string;
}

export interface UserProfile {
  name: string;
  email: string;
}
