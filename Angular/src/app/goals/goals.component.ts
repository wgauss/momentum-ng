import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { GoalService } from '../goals.service';
import { Goal, SubGoal } from '../goals.model';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgbModal, NgbDropdownModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-goals',
  standalone: true,
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.css'],
  imports: [HttpClientModule, CommonModule, ReactiveFormsModule,NgbDropdownModule],
  providers: [GoalService]
})
export class GoalsComponent implements OnInit {
  goals: Goal[] = [];
  progressSummary: string = '';
  goalForm: FormGroup;
  private modalService = inject(NgbModal);
  constructor(private goalService: GoalService, private fb: FormBuilder) {
    this.goalForm = this.fb.group({
      title: ['', Validators.required],
      mainObjective: ['', Validators.required],
      description: [''],
      subGoals: this.fb.array([]),
      targetDate: ['' , Validators.required],
    });
  }
  ngOnInit(): void {
    this.getGoals()
  }
  getGoals(){
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
  removeGoal(goal:Goal){
	if(goal.id){
		this.goalService.deleteGoal(goal.id?.toString()?? '').subscribe((response) => {
			console.log('Goal removed successfully:', response);
			this.getGoals()
		},
		  (error) => {
			console.error('Error adding event:', error);
		  })
		
	} else {
		console.log("omg!")
	}
  }
  openCreateEditGoalModal(CreateGoalModal:TemplateRef<any>, goal?:Goal){
	if(goal){
		//do something
	}
    this.modalService.open(CreateGoalModal, { centered: true });
  }

  // Create a new SubGoal FormGroup
  createSubGoal(subGoal?: SubGoal): FormGroup {
    return this.fb.group({
      title: [subGoal?.title || ''],
      currentValue: [subGoal?.currentValue || 0],
      targetValue: [subGoal?.targetValue || 0],
      unit: [subGoal?.unit || ''],
    });
  }

  // Getter for the subGoals FormArray
  get subGoals(): FormArray {
    return this.goalForm.get('subGoals') as FormArray;
  }

  // Method to add a new SubGoal to the form
  addSubGoal(): void {
    this.subGoals.push(this.createSubGoal());
  }

  // Method to remove a SubGoal from the form
  removeSubGoal(index: number): void {
    this.subGoals.removeAt(index);
  }
  
  checkValidation(): boolean{
	let subGoalFlag: boolean = false;
	
	if(this.goalForm.get('subGoals')?.value.length > 0){
		subGoalFlag = true
		this.subGoals.controls.forEach((control, index) => {
			if (control.value.title.length === 0 || 
				(control.value.currentValue === control.value.targetValue) || 
				control.value.unit.length === 0 ){
					subGoalFlag = true
			} else {
				subGoalFlag = false
			}
		});
	}
	return !this.goalForm.valid || subGoalFlag
  }
  // Method to handle form submission
  onSubmit(): void {
    if (this.goalForm.valid) {
      const newGoal: Goal = this.goalForm.value;
      console.log('Form Submitted', newGoal);
	  
	  this.goalService.addGoal(newGoal).subscribe(
			(response) => {
			  console.log('Goal added successfully:', response);
			  this.getGoals(); // Refresh the list of goals
			},
			(error) => {
			  console.error('Error adding goal:', error);
			}
		  );
    }
  }
}
