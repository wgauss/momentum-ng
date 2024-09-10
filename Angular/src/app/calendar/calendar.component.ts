import { Component, OnInit, inject, TemplateRef } from '@angular/core';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addMonths, subMonths, eachDayOfInterval, differenceInDays, differenceInMonths, differenceInYears} from 'date-fns';
import { NgbModal, NgbDropdownModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { enUS, id } from 'date-fns/locale';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../schedule.service';
import { ScheduleItem } from '../schedule.model';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { arrowLeft, NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
const icons = { arrowLeft };

import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ColorPickerModule } from 'ngx-color-picker';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule, NgbTypeaheadModule, FormsModule, NgxBootstrapIconsModule, ReactiveFormsModule, ColorPickerModule ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [ScheduleService]
})
export class CalendarComponent implements OnInit {
  referenceDate: Date = new Date();
  currentDate: Date = new Date();
  displayMonth: string = '';
  calendar: Date[][] = [];
  weekdays: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  range: number = 5; // Number of rows (weeks) to display
  height: number = 500; 
  computedHeight: number = this.height / this.range; // Height per calendar cell
  events: ScheduleItem[] = [] 
  event = {
	title: "", 
	desc: "", 
	date: "", 
	time: "", 
	exists: false, 
	id: "",
	color: "",
	startTime: "",
	endTime: "",
	location: "",
	isAllDay: false,
	isRecurring: false
}
  reminderFlag = true;
  reccuringType = "";
  eventForm: FormGroup;

  hourNumbers: Array<{label: string, deg: number}> = [];
  minuteNumbers: Array<{label: string, deg: number}> = [];
  radiusHour: number = 175;
  radiusMinute: number = 150;
  clockHeight: number = 500;
  activeHour: string = "From";
  activeMinute: string = "From";
  color: any;
  constructor(private scheduleService: ScheduleService, private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      location: [''],
      description: [''],
      isAllDay: [true],
      startTime: [''],
      endTime: [''],
      isRecurring: [false],
      recurrenceFrequency: [''],
      reminders: this.fb.array([]),  // Initialize FormArray for reminders
	  color: '',
	  hourFrom:'',
	  minuteFrom: '',
	  hourTo:'',
	  minuteTo: '',
	
	});
  }

  private modalService = inject(NgbModal);
  
  ngOnInit(): void {
    this.updateCalendar();
    this.loadScheduleItems();
    this.generateNumbers();
  }

  // FormArray helper
  get reminders(): FormArray {
    return this.eventForm.get('reminders') as FormArray;
  }

  // Add a new reminder to the FormArray
  addReminder(): void {
    this.reminders.push(this.fb.group({
      amount: [null, Validators.required],
      unit: ['Days', Validators.required]
    }));
  }

  // Remove a reminder from the FormArray
  removeReminder(index: number): void {
    this.reminders.removeAt(index);
  }

  updateCalendar(): void {
    const startOfMonthDate = startOfMonth(this.currentDate);
    const endOfMonthDate = endOfMonth(this.currentDate);
    const startDate = startOfWeek(startOfMonthDate, { weekStartsOn: 0 });
    const endDate = endOfWeek(endOfMonthDate, { weekStartsOn: 0 });

    const daysArray = eachDayOfInterval({ start: startDate, end: endDate });
    
    this.calendar = [];
    for (let i = 0; i < this.range; i++) {
      const startIdx = i * 7;
      const endIdx = startIdx + 7;
      this.calendar.push(daysArray.slice(startIdx, endIdx));
    }

    this.displayMonth = format(this.currentDate, 'MMMM ', { locale: enUS });
  }

  changeMonth(offset: number): void {
    this.currentDate = offset > 0 ? addMonths(this.currentDate, offset) : subMonths(this.currentDate, -offset);
    this.updateCalendar();
  }

  onYearChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.currentDate = new Date(this.currentDate.setFullYear(Number(input.value)));
    this.updateCalendar();
  }
  
  onViewChange(num:number): void {
      const newComputedHeight = this.height / num;

    /* this.animateLerp(this.computedHeight, newComputedHeight, .333, (value) => {
      this.computedHeight = value;
      this.updateCalendar();
    }); */
    this.computedHeight = newComputedHeight;
    this.range = num;
	this.updateCalendar();
  }
  
  setRecurringType(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.reccuringType = input.value;
  }
  setReminderFlag(){
    this.reminderFlag = !this.reminderFlag
  }
  
  formatDay(day: Date): string {
    if (day.getMonth() != this.currentDate.getMonth()){
      return format(day, 'MMMM d');
    } else {
      return format(day, 'd'); // 'd' gives the day of the month
    }
  }

  changeToCurrentDay() : void {
    this.currentDate = new Date();
    this.displayMonth = format(this.currentDate, 'MMMM ', { locale: enUS });
    this.updateCalendar();
  }

  isCurrentDate(referenceDate: Date): boolean {
    return this.currentDate.toDateString() === referenceDate.toDateString();
  }

  checkEventDay(event: ScheduleItem, day: Date): boolean {
	if (!event.date) {
	  return false;
	}
  
	const eventDate = new Date(event.date);
	const checkDate = new Date(day);
  
	// Check if the event date matches the check date
	if (eventDate.toLocaleDateString() === checkDate.toLocaleDateString()) {
	  return true;
	}
  
	// Handle recurring events
	if (event.isRecurring && event.reccurring) {
	  // Get the weekday name of the checkDate
	  const checkDayOfWeek = format(checkDate, "EEEE");
  
	  // Handle fixed recurrence like 'Everyday' and specific weekdays
	  if (event.reccurring === 'Everyday') {
		return true;
	  } else if (event.reccurring === checkDayOfWeek) {
		return true;
	  } else {
		// Handle custom recurrence like 'Every 3 Days'
		const recurrencePattern = event.reccurring.match(/Every (\d+) (\w+)/);
		if (recurrencePattern) {
		  const number = parseInt(recurrencePattern[1], 10);
		  const unit = recurrencePattern[2];
  
		  switch (unit) {
			case 'seconds':
			  // Not commonly used for long-term events
			  return false;
			case 'Hours':
			  // This requires a more complex comparison involving time as well as date
			  return false;
			case 'Days':
			  return differenceInDays(checkDate, eventDate) % number === 0;
			case 'Months':
			  const monthsDiff = differenceInMonths(checkDate, eventDate);
			  return monthsDiff % number === 0;
			case 'Years':
			  const yearsDiff = differenceInYears(checkDate, eventDate);
			  return yearsDiff % number === 0;
			default:
			  return false;
		  }
		}
	  }
	}
  
	return false;
  }
  loadScheduleItems(): void {
    this.scheduleService.getScheduleItems().subscribe(items => this.events = items);
  }

  openEventModal(content: TemplateRef<any>, eventObj: ScheduleItem) {
    this.event.title = eventObj.title;
    this.event.desc = eventObj.description;
    this.event.date = eventObj.date ? format(eventObj.date, 'MMMM / d / yyyy') : '';
	this.event.color = eventObj.color ?? '';
	this.event.startTime = eventObj.startTime ?? '';
	this.event.endTime = eventObj.endTime ?? '';
	this.event.location = eventObj.location ?? '';
	this.event.isAllDay = eventObj.isAllDay ?? false;
	this.event.isRecurring = eventObj.isRecurring ?? false;
    this.modalService.open(content, { centered: true });
  }
  
  createUpdateEventModal(addUpdateEvent: TemplateRef<any>, eventObj: Date, event?: ScheduleItem){
    if(event){
		this.eventForm.get('title')?.setValue(event.title);
		this.eventForm.get('location')?.setValue(event.location) ?? '';
		this.eventForm.get('description')?.setValue(event.description) ?? '';
		this.eventForm.get('isAllDay')?.setValue(event.isAllDay) ?? '';
		this.eventForm.get('startTime')?.setValue(event.startTime) ?? '';
		this.eventForm.get('endTime')?.setValue(event.endTime) ?? '';
		this.eventForm.get('isRecurring')?.setValue(event.isRecurring) ?? '';
		this.eventForm.get('recurrenceFrequency')?.setValue(event.reccurring) ?? '';
		this.eventForm.get('reminders')?.setValue(event.reminders) ?? '';
		this.eventForm.get('color')?.setValue(event.color) ?? '';
		this.color = event.color;

		if(this.eventForm.get('isAllDay')){
			let startTime = this.eventForm.get('startTime')?.value.split(':'); 
			let endTime = this.eventForm.get('endTime')?.value.split(':'); 
			
			this.eventForm.get('hourFrom')?.setValue(startTime[0]);
			this.eventForm.get('minuteFrom')?.setValue(startTime[1]);
			this.eventForm.get('hourTo')?.setValue(endTime[0]);
			this.eventForm.get('minuteTo')?.setValue(endTime[1]);
		}
		this.event.exists = true;
		this.event.id = event.id?.toString() ?? '';
	}
	this.event.date = eventObj.toLocaleDateString() ? format(eventObj.toLocaleDateString(), 'MMMM / dd / yyyy') : '';

    this.modalService.open(addUpdateEvent, { centered: true });
  }
  removeEvent(event:ScheduleItem){
	if(event.id){
		this.scheduleService.deleteScheduleItem(event.id?.toString()?? '').subscribe((response) => {
			console.log('Event removed successfully:', response);
			this.loadScheduleItems(); // Refresh the list of schedule items
			this.updateCalendar(); // Refresh the calendar
		  },
		  (error) => {
			console.error('Error adding event:', error);
		  })
		
	} else {
		console.log("omg!")
	}
	this.updateCalendar()
  }
  lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }
  animateLerp(start: number, end: number, duration: number, updateCallback: (value: number) => void): void {
    const startTime = performance.now();
    
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / (duration * 500), 1); // duration in milliseconds
      
      const value = this.lerp(start, end, progress);
      updateCallback(value);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }

  generateNumbers(): void {
    for (let i = 0; i <= 23; i++) {
      this.hourNumbers.push({ label: i.toString(), deg: (i) * 15 });
    }
    for (let i = 0; i <= 59; i++) {
      this.minuteNumbers.push({ label: i.toString(), deg: (i) * 6 });
    }
  }

  insertHour(event: Event) {
    const clickedElement = event.target as HTMLElement;
    let value = clickedElement.innerHTML
    let formatted = "";
    if(value.length < 2){
      formatted = "0" + value;
    } else {
      formatted = value;
    }
    if (this.activeHour == "From"){
      (document.getElementById("hourFrom") as HTMLInputElement).value = formatted;
      this.activeHour = "To"; 
    } else if (this.activeHour == "To"){
      (document.getElementById("hourTo") as HTMLInputElement).value = formatted;
      this.activeHour = "From"; 
    } 
  }
  insertMinute(event: Event) {
    const clickedElement = event.target as HTMLElement;
    let value = clickedElement.innerHTML
    let formatted = "";
    if(value.length < 2){
      formatted = "0" + value;
    } else {
      formatted = value;
    }
    if (this.activeMinute == "From"){
      (document.getElementById("minuteFrom") as HTMLInputElement).value = formatted;
      this.activeMinute = "To"; 
    } else if (this.activeMinute == "To"){
      (document.getElementById("minuteTo") as HTMLInputElement).value = formatted;
      this.activeMinute = "From"; 
    } 
  }
  setActiveHour(which:string){
    this.activeHour = which;
  }
  setActiveMinute(which:string){
    this.activeMinute = which;
  }
  checkValidation(): boolean {
    // Get the value of the isAllDay control
    const isAllDay = this.eventForm.get('isAllDay')?.value;
  
    if (isAllDay) {
      // If isAllDay is true, validation only depends on the overall form validity
      return !this.eventForm.valid;
    } else {
      // If isAllDay is false, perform additional validation for time fields
      const hourFrom = (document.getElementById("hourFrom") as HTMLInputElement)?.value;
      const minuteFrom = (document.getElementById("minuteFrom") as HTMLInputElement)?.value;
      const hourTo = (document.getElementById("hourTo") as HTMLInputElement)?.value;
      const minuteTo = (document.getElementById("minuteTo") as HTMLInputElement)?.value;
  
      // Perform validation checks
      const isHourFromValid = hourFrom && hourFrom.length === 2;
      const isMinuteFromValid = minuteFrom && minuteFrom.length === 2;
      const isHourToValid = hourTo && hourTo.length === 2;
      const isMinuteToValid = minuteTo && minuteTo.length === 2;
  
      // Return validation result
      return !this.eventForm.valid || !(isHourFromValid && isMinuteFromValid && isHourToValid && isMinuteToValid);
    }
  }
  resetForm(){
		this.eventForm.reset()
		this.event.id = "";
		this.event.exists = false
		this.eventForm.get('isAllDay')?.setValue(true)
		this.color = ""
  }
  onSubmit(update? :boolean): void {
    if (this.eventForm.valid) {
      if(!this.eventForm.get('isAllDay')?.value){
        let fromTime = (document.getElementById("hourFrom") as HTMLInputElement).value + ":" + (document.getElementById("minuteFrom") as HTMLInputElement).value;
        let toTime = (document.getElementById("hourTo") as HTMLInputElement).value + ":" + (document.getElementById("minuteTo") as HTMLInputElement).value;
        this.eventForm.get('startTime')?.setValue(fromTime);
        this.eventForm.get('endTime')?.setValue(toTime);
      }
      if(this.eventForm.get('isRecurring')?.value){
        if (this.reccuringType == "2"){
          let weekday = (document.getElementById("recurrenceWeekday") as HTMLInputElement).value;
          this.eventForm.get('recurrenceFrequency')?.setValue(weekday);
        } else if (this.reccuringType == "3"){
          let customValue = (document.getElementById("recurrenceCustomValue") as HTMLInputElement).value;
          let customType  = (document.getElementById("recurrenceCustomType") as HTMLInputElement).value;
          this.eventForm.get('recurrenceFrequency')?.setValue("Every "+ customValue + " " + customType);
        } else {
          this.eventForm.get('recurrenceFrequency')?.setValue("Everyday");
        }
      } else {
        this.eventForm.get('recurrenceFrequency')?.setValue("");
      }
      this.eventForm.get('color')?.setValue(this.color);
	  let newEvent: ScheduleItem = {
		title: this.eventForm.get('title')?.value,
		description: this.eventForm.get('description')?.value,
		date: format(this.event.date, "yyyy-MM-dd"),
		isAllDay: this.eventForm.get('isAllDay')?.value,
		startTime: this.eventForm.get('startTime')?.value,
		endTime: this.eventForm.get('endTime')?.value,
		isRecurring: this.eventForm.get('isRecurring')?.value,
		reccurring: this.eventForm.get('recurrenceFrequency')?.value,
		reminders: this.eventForm.get('reminders')?.value,
		color: this.eventForm.get('color')?.value,
		location: this.eventForm.get('location')?.value,
		id: this.event.id.toString()
	  }
	  if(update){
		this.scheduleService.updateScheduleItem(newEvent).subscribe(
			(response) => {
			  console.log('Event added successfully:', response);
			  this.loadScheduleItems(); // Refresh the list of schedule items
			  this.updateCalendar(); // Refresh the calendar
			},
			(error) => {
			  console.error('Error adding event:', error);
			}
		  );
	  } else {
		this.scheduleService.addScheduleItem(newEvent).subscribe(
			(response) => {
			  console.log('Event added successfully:', response);
			  this.loadScheduleItems(); // Refresh the list of schedule items
			  this.updateCalendar(); // Refresh the calendar
			},
			(error) => {
			  console.error('Error adding event:', error);
			}
		  );
	  }
	  this.resetForm();
	  this.modalService.dismissAll("cause");
	}
  }
}
