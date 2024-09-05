import { 
	Component, 
	OnInit,
	inject, 
	TemplateRef,
	ViewChild,
	ElementRef
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
	NgbDropdownModule,
	NgbTypeaheadConfig, 
	NgbTypeaheadModule
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
  import { debounceTime, 
	distinctUntilChanged, 
	map 
} from 'rxjs/operators';
import { FormsModule } from '@angular/forms';
import { arrowLeft, NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
const icons = {
	arrowLeft
}
  @Component({
	selector: 'app-calendar',
	standalone: true,
	imports: [CommonModule, HttpClientModule, NgbDropdownModule, NgbTypeaheadModule, FormsModule, NgxBootstrapIconsModule],
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
	event = {title: "", desc: "", date: "", time: ""}
	reccuringFlag = true;
	reminderFlag = true;
	allDayFlag = true;
	reccuringType = "";

	hourNumbers: Array<{label: string, deg: number}> = [];
	minuteNumbers: Array<{label: string, deg: number}> = [];
	radiusHour: number = 175;
  	radiusMinute: number = 150;
	clockHeight: number = 500;
	activeHour: string = "From";
	activeMinute: string = "From";


	constructor(private scheduleService: ScheduleService) { }
	
	private modalService = inject(NgbModal);
  
	ngOnInit(): void {
		this.updateCalendar();
		this.loadScheduleItems();
		this.generateNumbers();
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
        const newRange = Number(input.value);
        const newComputedHeight = this.height / newRange;

		this.animateLerp(this.computedHeight, newComputedHeight, .333, (value) => {
			this.computedHeight = value;
			this.updateCalendar();
		});
        
        this.range = newRange;
    }
	setReccuringFlag(){
		this.reccuringFlag = !this.reccuringFlag
	}
	setRecurringType(event: Event): void {
		const input = event.target as HTMLInputElement;
		this.reccuringType = input.value;
	}
	setReminderFlag(){
		this.reminderFlag = !this.reminderFlag
	}
	setAllDayFlag(){
		this.allDayFlag = !this.allDayFlag
		this.animateLerp(0, this.clockHeight, .666, (value) => {
			this.clockHeight = value;
			this.updateCalendar();
		});
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

	createEventModal(addEvent: TemplateRef<any>){
		this.modalService.open(addEvent, { centered: true });
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
	// Under this are what should be in clock / time Picker component in the future
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
}
  