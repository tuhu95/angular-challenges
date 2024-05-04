import { Component } from '@angular/core';
import { TodoListComponent } from './components/todo-list.component';
@Component({
  standalone: true,
  imports: [TodoListComponent],
  selector: 'app-root',
  template: `
    <app-todo-list />
  `,
  styles: [],
})
export class AppComponent {}
