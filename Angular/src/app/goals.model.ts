// goals.model.ts
export interface Goal {
	id?: string; // Optional ID for the goal
	title: string;
	mainObjective: string;
	sub_goals: SubGoal[]; // Ensure this matches API response
	target_date: string; // Use 'string' if the API sends dates as strings
  }
  
  export interface SubGoal {
	id?: string; // Optional ID for each subgoal, if applicable
	title: string;
	currentValue: number; // Ensure this matches API response
	targetValue: number; 
	unit: string;
	progress?: number; // Percentage progress
  }
  