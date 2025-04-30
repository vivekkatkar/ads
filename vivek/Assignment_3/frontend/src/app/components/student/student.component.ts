import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Department {
  dept_name: string;
  building?: string;
  budget?: number;
}

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="max-w-6xl mx-auto p-6 bg-gray-100 shadow-lg rounded-xl">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    
    <!-- Student Form -->
    <div class="p-6 bg-white shadow-md rounded-xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Student Form</h2>
      <form (ngSubmit)="submitForm()" class="space-y-4">
        <div>
          <label class="block font-semibold text-gray-700">ID:</label>
          <input type="number" [(ngModel)]="student.ID" name="ID" required
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none">
        </div>
        <div>
          <label class="block font-semibold text-gray-700">Name:</label>
          <input type="text" [(ngModel)]="student.name" name="name" required
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none">
        </div>
        <div>
          <label class="block font-semibold text-gray-700">Department:</label>
          <select [(ngModel)]="student.dept_name" name="dept_name" required
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none">
            <option *ngFor="let dept of departments" [value]="dept.dept_name">{{ dept.dept_name }}</option>
          </select>
        </div>
        <div>
          <label class="block font-semibold text-gray-700">Total Credits:</label>
          <input type="number" [(ngModel)]="student.tot_cred" name="tot_cred"
            class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none">
        </div>
        <button type="submit"
          class="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition">
          Add Student
        </button>
      </form>
    </div>

    <!-- Student List -->
    <div class="p-6 bg-white shadow-md rounded-xl">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Student List</h2>
      <div class="flex flex-col gap-4">
        <div *ngFor="let s of students" class="p-4 bg-gray-50 border rounded-lg shadow">
          <div class="font-semibold text-gray-900">{{ s.ID }}</div>
          <div class="text-gray-700">{{ s.name }}</div>
          <div class="text-blue-600">{{ s.dept_name }}</div>
          <div class="text-gray-500">{{ s.tot_cred }} Credits</div>
        </div>
      </div>
    </div>

  </div>
</div>

  `,
})
export class StudentComponent {
  student = { ID: null, name: '', dept_name: '', tot_cred: null };
  students: any[] = [];
  departments: Department[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getStudents();
    this.getDepartments();
  }

  getStudents() {
    this.http.get<any[]>('http://localhost:5000/students')
      .subscribe(data => this.students = data);
  }

  getDepartments() {
    this.http.get<Department[]>('http://localhost:5000/departments')
      .subscribe(data => this.departments = data);
  }

  submitForm() {
    this.http.post('http://localhost:5000/students', this.student)
      .subscribe(response => {
        console.log('Student added:', response);
        this.getStudents();
        this.student = { ID: null, name: '', dept_name: '', tot_cred: null };
      });
  }
}
