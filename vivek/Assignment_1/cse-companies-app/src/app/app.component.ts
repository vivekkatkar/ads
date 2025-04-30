import { Component } from '@angular/core';
import { CompanyListComponent } from './company-list.component';
import { CompanyFormComponent } from './company-form.component';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{ title }}</h1>
    <app-company-list></app-company-list>
    <app-company-form></app-company-form>
  `,
  standalone: true,
  imports: [CompanyListComponent, CompanyFormComponent]
})
export class AppComponent {
  title = 'cse-companies-app';
}
