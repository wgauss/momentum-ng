import { 
	Component, 
	OnInit,
	inject, 
	TemplateRef
  } from '@angular/core';
  import { 
	format, 
	startOfMonth, 
	endOfMonth, 
	startOfWeek, 
	endOfWeek, 
	addMonths, 
	subMonths, 
	eachDayOfInterval 
  } from 'date-fns';
  import { 
	NgbModal, 
	NgbDropdownModule 
  } from '@ng-bootstrap/ng-bootstrap';
  import { 
	enUS 
  } from 'date-fns/locale';
  import { 
	CommonModule 
  } from '@angular/common';
  import { 
	ScheduleService 
  } from '../schedule.service';
  import { 
	ScheduleItem 
  } from '../schedule.model';
  import { 
	HttpClientModule 
  } from '@angular/common/http';
  
  @Component({
	selector: 'app-calendar',
	standalone: true,
	imports: [CommonModule, HttpClientModule, NgbDropdownModule],
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
	event = {title: "", desc: "", date: ""}
	
	constructor(private scheduleService: ScheduleService) { }
	
	private modalService = inject(NgbModal);
  
	ngOnInit(): void {
	  this.updateCalendar();
	  this.loadScheduleItems();
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
  
	onRangeChange(event: Event): void {
	  const input = event.target as HTMLInputElement;
	  this.range = Number(input.value);
	  this.computedHeight = this.height / this.range;
	  this.updateCalendar();
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
	  return eventDate.toLocaleDateString() == checkDate.toLocaleDateString();
	}
  
	loadScheduleItems(): void {
	  this.scheduleService.getScheduleItems().subscribe(items => this.events = items);
	}
  
	openEventModal(content: TemplateRef<any>, eventObj: ScheduleItem) {
	  this.event.title = eventObj.title;
	  this.event.desc = eventObj.description;
	  this.event.date = eventObj.date ? format(eventObj.date, 'MMMM / d / yyyy') : '';
	  this.modalService.open(content, { centered: true });
	}
  }
  