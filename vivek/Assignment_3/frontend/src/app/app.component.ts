import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <nav class="bg-blue-600 p-4 text-white flex justify-center">
      <div class="flex space-x-6">
        <a routerLink="/students" class="hover:text-yellow-300">Students</a>
        <a routerLink="/instructors" class="hover:text-yellow-300">Instructors</a>
        <a routerLink="/courses" class="hover:text-yellow-300">Courses</a>
        <a routerLink="/departments" class="hover:text-yellow-300">Departments</a>
        <a routerLink="/classrooms" class="hover:text-yellow-300">Classrooms</a>
        <a routerLink="/advisors" class="hover:text-yellow-300">Advisors</a>
        <a routerLink="/prereqs" class="hover:text-yellow-300">Prerequisites</a>
        <a routerLink="/sections" class="hover:text-yellow-300">Sections</a>
        <a routerLink="/time-slots" class="hover:text-yellow-300">Time Slots</a>
        <a routerLink="/teaches" class="hover:text-yellow-300">Teaches</a>
        <a routerLink="/takes" class="hover:text-yellow-300">Takes</a>
      </div>
    </nav>
    <div class="p-4">
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {}
