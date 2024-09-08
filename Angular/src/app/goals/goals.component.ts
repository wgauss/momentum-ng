import { Component, OnInit } from '@angular/core';

// Define interfaces outside of the component class
export interface Goal {
  title: string;
  mainObjective: string;
  subGoals: SubGoal[];
  currentProgress: Progress;
  targetDate: Date;
}

export interface SubGoal {
  title: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  progress?: number; // Percentage progress
}

export interface Progress {
  [key: string]: number; // General progress tracker for various metrics
}

@Component({
  selector: 'app-goals',
  standalone: true,
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css']
})
export class GoalsComponent implements OnInit {
  goal: Goal;
  progressSummary: string = ''; // Initialized with a default value

  constructor() {
    this.goal = {
      title: "Lose Weight and Improve Fitness",
      mainObjective: "Lose 40 lbs by December 2024 and improve fitness levels",
      subGoals: [
        { title: "Weight Loss", currentValue: 10, targetValue: 40, unit: " lbs" },
        { title: "Daily Workout", currentValue: 3.75, targetValue: 5, unit: " hours" },
        { title: "Fasting Hours", currentValue: 18, targetValue: 18, unit: " hours" },
        { title: "Protein Intake", currentValue: 180, targetValue: 180, unit: " grams" }
      ],
      currentProgress: {},
      targetDate: new Date('2024-12-31')
    };
  }

  ngOnInit(): void {
    this.progressSummary = this.calculateProgress(this.goal);
  }

  calculateProgress(goal: Goal): string {
    // Calculate total progress
    let totalProgress = 0;
    let totalWeight = 0;
    let progressDetails: string[] = [];

    for (const subGoal of goal.subGoals) {
      const progress = (subGoal.currentValue / subGoal.targetValue) * 100;
      subGoal.progress = progress;
      progressDetails.push(
        `${subGoal.title}: ${subGoal.currentValue}${subGoal.unit} / ${subGoal.targetValue}${subGoal.unit} (${progress.toFixed(2)}%)`
      );
      totalProgress += progress;
      totalWeight += 1; // Assuming equal weight for each subgoal
    }

    // Average progress
    const averageProgress = totalProgress / totalWeight;

    // Estimated completion time (simplistic estimation)
    const now = new Date();
    const remainingDays = Math.max(0, Math.ceil((goal.targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const estimatedCompletion = (averageProgress >= 100) ? 'Goal achieved' : `On track to complete in ${remainingDays} days`;

    // Construct summary
    return `
      Goal Title: ${goal.title}
      Main Objective: ${goal.mainObjective}
      Progress:
      ${progressDetails.join('\n')}
      Overall Progress: ${averageProgress.toFixed(2)}%
      Estimated Completion: ${estimatedCompletion}
    `;
  }
}
