import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { randText } from '@ngneat/falso';
import { TodoService } from './data-access/todo.service';
import { TodoStore } from './data-access/todo.store';
import { TodoDto } from './model/todo.model';
@Component({
  standalone: true,
  imports: [CommonModule],
  providers: [TodoStore, TodoService],
  selector: 'app-root',
  template: `
    @for (todo of state().data; track $index) {
      <div>
        {{ todo.title }}
        <button (click)="update(todo)">
          @if (todo.isLoading) {
            Loading...
          } @else {
            Update
          }
        </button>
      </div>
    }
  `,
  styles: [],
})
export class AppComponent {
  private readonly todoStore = inject(TodoStore);
  public state = this.todoStore.state;

  public update(todo: TodoDto) {
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
