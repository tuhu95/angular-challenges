import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { randText } from '@ngneat/falso';
import { TodoService } from './data-access/todo.service';
import { TodoStore } from './data-access/todo.store';
import { Todo } from './model/todo.model';
@Component({
  standalone: true,
  imports: [CommonModule],
  providers: [TodoStore, TodoService],
  selector: 'app-root',
  template: `
    <div *ngFor="let todo of todos()">
      {{ todo.title }}
      <button (click)="update(todo)">Update</button>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  private readonly todoStore = inject(TodoStore);
  public todos = this.todoStore.todosState;

  public update(todo: Todo) {
    this.todoStore.updateTodoAction.next({
      id: todo.id,
      body: JSON.stringify({
        userId: todo.userId,
        title: randText(),
        completed: !todo.completed,
      }),
    });
  }
}
