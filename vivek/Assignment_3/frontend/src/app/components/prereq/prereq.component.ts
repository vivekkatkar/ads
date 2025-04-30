import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-prereq',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 bg-gray-100 shadow rounded">
      <div class="flex gap-6">
        <!-- Prerequisite Form -->
        <div class="w-1/2">
          <h2 class="text-2xl font-bold mb-4">Prerequisite Form</h2>
          <form (ngSubmit)="submitForm()">
            <div class="mb-4">
              <label class="block font-semibold">Course:</label>
              <select [(ngModel)]="prereq.course_id" name="course_id" required class="w-full p-2 border rounded">
                <option *ngFor="let c of courses" [value]="c.course_id">{{ c.course_id }} - {{ c.title }}</option>
              </select>
            </div>
            <div class="mb-4">
              <label class="block font-semibold">Prerequisite Course:</label>
              <select [(ngModel)]="prereq.prereq_id" name="prereq_id" required class="w-full p-2 border rounded">
                <option *ngFor="let c of courses" [value]="c.course_id">{{ c.course_id }} - {{ c.title }}</option>
              </select>
            </div>
            <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Add Prerequisite</button>
          </form>
        </div>

        <!-- Prerequisite List -->
        <div class="w-1/2">
          <h2 class="text-2xl font-bold mb-4">Prerequisite List</h2>
          <div class="border rounded p-4 bg-gray-50 max-h-[300px] overflow-y-auto">
            <div class="grid grid-cols-2 gap-4 font-bold bg-gray-200 p-2 rounded">
              <div>Course</div>
              <div>Prerequisite</div>
            </div>
            <div class="grid grid-cols-2 gap-4 mt-2">
              <div *ngFor="let p of prereqs" class="border-b p-2">
                {{ getCourseTitle(p.course_id) }}
              </div>
              <div *ngFor="let p of prereqs" class="border-b p-2">
                {{ getCourseTitle(p.prereq_id) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PrereqComponent {
  prereq = { course_id: '', prereq_id: '' };
  prereqs: any[] = [];
  courses: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getPrereqs();
    this.getCourses();
  }

  getPrereqs() {
    this.http.get<any[]>('http://localhost:5000/prereqs')
      .subscribe(data => this.prereqs = data);
  }

  getCourses() {
    this.http.get<any[]>('http://localhost:5000/courses')
      .subscribe(data => this.courses = data);
  }

  submitForm() {
    this.http.post('http://localhost:5000/prereqs', this.prereq)
      .subscribe(response => {
        console.log('Prerequisite added:', response);
        this.getPrereqs();
        this.prereq = { course_id: '', prereq_id: '' };
      });
  }

  getCourseTitle(courseId: string): string {
    const course = this.courses.find(c => c.course_id === courseId);
    return course ? course.title : 'Unknown Course';
  }
}
