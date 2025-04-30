import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-takes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-xl">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <!-- Takes Form -->
    <div class="p-6 bg-white shadow-md rounded-xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Enroll Student in Section</h2>
      <form (ngSubmit)="submitForm()" class="space-y-4">
        
        <!-- Select Student -->
        <div>
          <label class="block font-semibold text-gray-700">Select Student:</label>
          <select [(ngModel)]="takes.ID" name="ID" required
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none">
            <option value="">Select Student</option>
            <option *ngFor="let s of students" [value]="s.ID">
              {{ s.name }} (ID: {{ s.ID }})
            </option>
          </select>
        </div>

        <!-- Select Section -->
        <div>
          <label class="block font-semibold text-gray-700">Select Section:</label>
          <select [(ngModel)]="selectedSection" name="section" (change)="onSectionChange($event)" required
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 outline-none">
            <option value="">Select Section</option>
            <option *ngFor="let s of sections" [value]="s.course_id + ',' + s.sec_id + ',' + s.semester + ',' + s.year">
              {{ getCourseTitle(s.course_id) }} - {{ s.sec_id }} - {{ s.semester }} {{ s.year }}
            </option>
          </select>
        </div>

        <!-- Grade input -->
        <div>
          <label class="block font-semibold text-green-700">Grade:</label>
          <input type="text" [(ngModel)]="takes.grade" name="grade"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
        </div>

        <button type="submit"
          class="w-full bg-green-700 text-white font-semibold py-3 rounded-lg hover:bg-green-800 transition">
          Add Enrollment
        </button>
      </form>
    </div>

    <!-- Takes List -->
    <div class="p-6 bg-white shadow-md rounded-xl">
      <h2 class="text-2xl font-bold mb-4 text-green-800">Enrolled Students</h2>
      <div class="flex flex-col gap-4">
        <div *ngFor="let t of takesList" class="p-4 bg-gray-50 border rounded-lg shadow hover:bg-gray-100">
          <div class="font-bold text-lg text-green-900">
            {{ getStudentName(t.ID) }} (ID: {{ t.ID }})
          </div>
          <div class="text-green-700">
            Enrolled in: {{ getCourseTitle(t.course_id) }} - {{ t.sec_id }} ({{ t.semester }} {{ t.year }})
          </div>
          <div class="text-green-600">Grade: {{ t.grade || "N/A" }}</div>
        </div>
      </div>
    </div>

  </div>
</div>

  `,
})
export class TakesComponent {
  takes = { ID: '', course_id: '', sec_id: '', semester: '', year: 0, grade: '' };
  takesList: any[] = [];
  students: any[] = [];
  sections: any[] = [];
  courses: any[] = []; 
  selectedSection: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getTakes();
    this.getStudents();
    this.getSections();
    this.getCourses(); // Fetch course details separately
  }

  getTakes() {
    this.http.get<any[]>('http://localhost:5000/takes')
      .subscribe(data => this.takesList = data);
  }

  getStudents() {
    this.http.get<any[]>('http://localhost:5000/students')
      .subscribe(data => this.students = data);
  }

  getSections() {
    this.http.get<any[]>('http://localhost:5000/sections')
      .subscribe(data => this.sections = data);
  }

  getCourses() {
    this.http.get<any[]>('http://localhost:5000/courses') // Fetch courses separately
      .subscribe(data => this.courses = data);
  }

  onSectionChange(event: any) {
    const value = event.target.value;
    if (value) {
      const [course_id, sec_id, semester, year] = value.split(',');
      this.takes.course_id = course_id;
      this.takes.sec_id = sec_id;
      this.takes.semester = semester;
      this.takes.year = +year;
    }
  }

  submitForm() {
    if (!this.takes.ID || !this.takes.course_id) {
      alert("Please select both student and section.");
      return;
    }

    this.http.post('http://localhost:5000/takes', this.takes)
      .subscribe(response => {
        console.log('Enrollment added:', response);
        this.getTakes();
        this.takes = { ID: '', course_id: '', sec_id: '', semester: '', year: 0, grade: '' };
        this.selectedSection = '';
      });
  }

  // ✅ Fix: Define getCourseTitle to match course_id with the correct title
  getCourseTitle(course_id: string): string {
    const course = this.courses.find(c => c.course_id === course_id);
    return course ? course.title : "Unknown Course";
  }

  getStudentName(ID: string): string {
    const student = this.students.find(s => s.ID === ID);
    return student ? student.name : "Unknown Student";
  }
}
