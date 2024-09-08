// goals.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Goal, SubGoal } from './goals.model';
@Injectable({
  providedIn: 'root',
})
export class GoalService {
  private apiUrl = 'http://localhost:3000/api/goals'; // URL of your Rails API endpoint

  constructor(private http: HttpClient) { }

  // Fetch goals from the API
  getGoals(): Observable<Goal[]> {
    return this.http.get<Goal[]>(this.apiUrl);
  }

  // Calculate progress for a specific goal
  calculateProgress(goal: Goal): string {
    if (!goal.sub_goals || !Array.isArray(goal.sub_goals)) {
      return 'No sub-goals available for this goal.';
    }

    let totalProgress = 0;
    let totalWeight = 0;
    let progressDetails: string[] = [];

    for (const subGoal of goal.sub_goals) {
      if (subGoal.currentValue == null || subGoal.targetValue == null) {
        continue; // Skip this sub-goal if it's missing required properties
      }

      const progress = (subGoal.currentValue / subGoal.targetValue) * 100;
      subGoal.progress = progress;
      progressDetails.push(
        `${subGoal.title}: ${subGoal.currentValue}${subGoal.unit} / ${subGoal.targetValue}${subGoal.unit} (${progress.toFixed(2)}%)`
      );
      totalProgress += progress;
      totalWeight += 1; // Assuming equal weight for each subgoal
    }

    const averageProgress = totalProgress / totalWeight;
    const now = new Date();
    const targetDate = new Date(goal.target_date);
    const remainingDays = Math.max(0, Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const estimatedCompletion = (averageProgress >= 100) ? 'Goal achieved' : `On track to complete in ${remainingDays} days`;

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
