import { Component, OnInit } from '@angular/core';
import { GoalService } from '../goals.service';
import { Goal } from '../goals.model';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-goals',
  standalone: true,
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css'],
  imports: [HttpClientModule,  CommonModule],
  providers: [GoalService]
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];
  progressSummary: string = '';

  constructor(private goalService: GoalService) { }

  ngOnInit(): void {
    this.goalService.getGoals().subscribe(
      goals => {
        this.goals = goals;
        if (this.goals.length > 0) {
          this.progressSummary = this.goalService.calculateProgress(this.goals[0]);
        } else {
          this.progressSummary = 'No goals available.';
        }
      },
      error => console.error('Error fetching goals:', error)
    );
  }
}
