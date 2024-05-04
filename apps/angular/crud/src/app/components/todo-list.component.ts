import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { randText } from '@ngneat/falso';
import { TodoListStore } from '../data-access/todo-list.store';
import { TodoService } from '../data-access/todo.service';
import { TodoListItem } from '../models/todo-list-item.model';
import { TodoItemComponent } from './todo-item.component';

@Component({
  standalone: true,
  selector: 'app-todo-list',
  imports: [TodoItemComponent],
  providers: [TodoListStore, TodoService],
  template: `
    @for (todo of todos(); track $index) {
      <app-todo
        [todo]="todo"
        (updateEvent)="update(todo)"
        (deleteEvent)="delete(todo.id)" />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoListComponent {
  private readonly todoStore = inject(TodoListStore);
  public todos = this.todoStore.entities;

  public update(todo: TodoListItem) {
    this.todoStore.update({
      id: todo.id,
      todo: {
        ...todo,
        title: randText(),
      },
    });
  }

  public delete(id: number) {
    this.todoStore.remove({ id });
  }
}
