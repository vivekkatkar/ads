import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-teaches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="max-w-2xl mx-auto p-6 bg-white shadow rounded">
  <h2 class="text-2xl font-bold mb-4">Teaches Form</h2>
  <form (ngSubmit)="submitForm()" class="mb-6">
    <!-- Select Instructor -->
    <div class="mb-4">
      <label class="block font-semibold">Instructor:</label>
      <select [(ngModel)]="teaches.ID" name="ID" required class="w-full p-2 border rounded">
        <option value="">Select Instructor</option>
        <option *ngFor="let i of instructors" [value]="i.ID">{{ i.name }} (ID: {{ i.ID }})</option>
      </select>
    </div>

    <!-- Select Section -->
    <div class="mb-4">
      <label class="block font-semibold">Section:</label>
      <select [(ngModel)]="selectedSection" name="section" (change)="onSectionChange($event)" required class="w-full p-2 border rounded">
        <option value="">Select Section</option>
        <option *ngFor="let s of sections" [value]="s.course_id + ',' + s.sec_id + ',' + s.semester + ',' + s.year">
          {{ getCourseTitle(s.course_id) }} - Sec: {{ s.sec_id }} ({{ s.semester }} {{ s.year }})
        </option>
      </select>
    </div>

    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Add Teaches Record</button>
  </form>

  <!-- Two-Column Layout for Teaches List -->
  <h2 class="text-2xl font-bold mt-6">Teaches List</h2>
  <div class="grid grid-cols-2 gap-4 mt-4">
    <div class="font-bold bg-gray-200 p-2 rounded">Instructor</div>
    <div class="font-bold bg-gray-200 p-2 rounded">Teaching Section</div>

    <div *ngFor="let t of teachesList" class="border-b p-2">
      {{ getInstructorName(t.ID) }}
    </div>
    <div *ngFor="let t of teachesList" class="border-b p-2">
      <strong>{{ getCourseTitle(t.course_id) }}</strong> - Section {{ t.sec_id }} ({{ t.semester }} {{ t.year }})
    </div>
  </div>
</div>

  `,
})
export class TeachesComponent {
  teaches = { ID: '', course_id: '', sec_id: '', semester: '', year: 0 };
  teachesList: any[] = [];
  instructors: any[] = [];
  sections: any[] = [];
  courses: any[] = []; 
  selectedSection: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getTeaches();
    this.getInstructors();
    this.getSections();
    this.getCourses(); 
  }

  getTeaches() {
    this.http.get<any[]>('http://localhost:5000/teaches')
      .subscribe(data => this.teachesList = data);
  }

  getInstructors() {
    this.http.get<any[]>('http://localhost:5000/instructors')
      .subscribe(data => this.instructors = data);
  }

  getSections() {
    this.http.get<any[]>('http://localhost:5000/sections')
      .subscribe(data => this.sections = data);
  }

  getCourses() {
    this.http.get<any[]>('http://localhost:5000/courses') 
      .subscribe(data => this.courses = data);
  }

  onSectionChange(event: any) {
    const value = event.target.value;
    if (value) {
      const [course_id, sec_id, semester, year] = value.split(',');
      this.teaches.course_id = course_id;
      this.teaches.sec_id = sec_id;
      this.teaches.semester = semester;
      this.teaches.year = +year;
    }
  }

  submitForm() {
    if (!this.teaches.ID || !this.teaches.course_id) {
      alert("Please select both an instructor and a section.");
      return;
    }

    this.http.post('http://localhost:5000/teaches', this.teaches)
      .subscribe(response => {
        console.log('Teaches record added:', response);
        this.getTeaches();
        this.teaches = { ID: '', course_id: '', sec_id: '', semester: '', year: 0 };
        this.selectedSection = '';
      });
  }

  getCourseTitle(course_id: string): string {
    const course = this.courses.find(c => c.course_id === course_id);
    return course ? course.title : "Unknown Course";
  }


  getInstructorName(ID: string): string {
    const instructor = this.instructors.find(i => i.ID === ID);
    return instructor ? instructor.name : "Unknown Instructor";
  }
}
