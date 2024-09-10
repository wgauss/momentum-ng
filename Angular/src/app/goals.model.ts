// goals.model.ts

export interface Goal {
	id?: string; // Optional ID for the goal
	title: string;
	mainObjective: string;
	subGoals: SubGoal[]; // Make sure the field name matches the API response
	targetDate: string; // Use 'string' if the API sends dates as strings
  }
  
  export interface SubGoal {
	id?: string; // Optional ID for each subgoal, if applicable
	title: string;
	currentValue: number; // Match the field names from the API
	targetValue: number;
	unit: string;
	progress?: number; // Percentage progress
  }
  
  export interface Progress {
	[key: string]: number; // General progress tracker for various metrics
  }
  