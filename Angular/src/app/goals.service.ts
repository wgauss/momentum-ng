// goals.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Goal, SubGoal } from './goals.model';
import { catchError, map } from 'rxjs/operators';

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
  addGoal(newGoal: Goal): Observable<Goal> {
	return this.http.post<Goal>(this.apiUrl, newGoal, {
	  headers: new HttpHeaders({
		'Content-Type': 'application/json'
	  })
	}).pipe(
	  catchError(this.handleError<Goal>('addGoal'))
	);
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  // Calculate progress for a specific goal
  calculateProgress(goal: Goal): string {
    if (!goal.subGoals || !Array.isArray(goal.subGoals)) {
      return 'No sub-goals available for this goal.';
    }
    
    let totalProgress = 0;
    let totalWeight = 0;
    let progressDetails: string[] = [];
  
    for (const subGoal of goal.subGoals as SubGoal[]) {
      // Ensure subGoal has the expected properties
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
    const targetDate = new Date(goal.targetDate);
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
