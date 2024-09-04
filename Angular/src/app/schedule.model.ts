export interface ScheduleItem {
	id: string; // Optional unique identifier
	date?: Date; // Optional date of the event
	startTime? : string; //in HH:MM f 24HR
	endTime? : string; //in HH:MM f 24HR
	weekday?: string; // Optional recurring weekday (e.g., "Monday", "Wednesday")
	group?: string;
	color?:string;
	title: string; // Title of the event
	description: string; // Description of the event
  }