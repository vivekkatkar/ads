import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="max-w-4xl mx-auto p-6 bg-gray-200 shadow rounded">
  <div class="flex gap-6">
    <!-- Section Form -->
    <div class="w-1/2">
      <h2 class="text-2xl font-bold mb-4">Section Form</h2>
      <form (ngSubmit)="submitForm()">
        <!-- Select Course -->
        <div class="mb-4">
          <label class="block font-semibold">Course:</label>
          <select [(ngModel)]="section.course_id" name="course_id" required class="w-full p-2 border rounded">
            <option *ngFor="let c of courses" [value]="c.course_id">{{ c.course_id }} - {{ c.title }}</option>
          </select>
        </div>
        <!-- Section ID, Semester, Year -->
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block font-semibold">Section ID:</label>
            <input type="text" [(ngModel)]="section.sec_id" name="sec_id" required class="w-full p-2 border rounded">
          </div>
          <div>
            <label class="block font-semibold">Semester:</label>
            <input type="text" [(ngModel)]="section.semester" name="semester" required class="w-full p-2 border rounded">
          </div>
        </div>
        <div class="mb-4">
          <label class="block font-semibold">Year:</label>
          <input type="number" [(ngModel)]="section.year" name="year" required class="w-full p-2 border rounded">
        </div>
        <!-- Select Classroom -->
        <div class="mb-4">
          <label class="block font-semibold">Classroom:</label>
          <select [(ngModel)]="selectedClassroom" name="classroom" (change)="onClassroomChange($event)" required class="w-full p-2 border rounded">
            <option value="">Select Classroom</option>
            <option *ngFor="let room of classrooms" [value]="room.building + ',' + room.room_number">
              {{ room.building }} - {{ room.room_number }}
            </option>
          </select>
        </div>
        <!-- Select Time Slot -->
        <div class="mb-4">
          <label class="block font-semibold">Time Slot:</label>
          <select [(ngModel)]="section.time_slot_id" name="time_slot_id" required class="w-full p-2 border rounded">
            <option value="">Select Time Slot</option>
            <option *ngFor="let t of timeSlots" [value]="t.time_slot_id">
              {{ t.time_slot_id }}: {{ t.day }} {{ t.start_time }}-{{ t.end_time }}
            </option>
          </select>
        </div>
        <button type="submit" class="bg-green-700 text-white px-4 py-2 rounded">Add Section</button>
      </form>
    </div>

    <!-- Section List -->
    <div class="w-1/2">
      <h2 class="text-2xl font-bold mb-4">Section List</h2>
      <ul class="border rounded p-4 bg-gray-50 max-h-[400px] overflow-y-auto">
        <li *ngFor="let s of sections" class="border-b p-2">
          {{ s.course_id }} - {{ s.sec_id }} - {{ s.semester }} - {{ s.year }} - {{ s.building }} {{ s.room_number }} - {{ s.time_slot_id }}
        </li>
      </ul>
    </div>
  </div>
</div>

  `,
})
export class SectionComponent {
  section = { course_id: '', sec_id: '', semester: '', year: null, building: '', room_number: '', time_slot_id: '' };
  sections: any[] = [];
  courses: any[] = [];
  classrooms: any[] = [];
  timeSlots: any[] = [];
  selectedClassroom: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getSections();
    this.getCourses();
    this.getClassrooms();
    this.getTimeSlots();
  }

  getSections() {
    this.http.get<any[]>('http://localhost:5000/sections')
      .subscribe(data => this.sections = data);
  }

  getCourses() {
    this.http.get<any[]>('http://localhost:5000/courses')
      .subscribe(data => this.courses = data);
  }

  getClassrooms() {
    this.http.get<any[]>('http://localhost:5000/classrooms')
      .subscribe(data => this.classrooms = data);
  }

  getTimeSlots() {
    this.http.get<any[]>('http://localhost:5000/time-slots')
      .subscribe(data => this.timeSlots = data);
  }

  onClassroomChange(event: any) {
    const value = event.target.value;
    if (value) {
      const [building, room_number] = value.split(',');
      this.section.building = building;
      this.section.room_number = room_number;
    }
  }

  submitForm() {
    this.http.post('http://localhost:5000/sections', this.section)
      .subscribe(response => {
        console.log('Section added:', response);
        this.getSections();
        this.section = { course_id: '', sec_id: '', semester: '', year: null, building: '', room_number: '', time_slot_id: '' };
        this.selectedClassroom = '';
      });
  }
}
