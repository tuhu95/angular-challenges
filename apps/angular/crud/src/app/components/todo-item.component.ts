import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import {
  TodoListItemWithStatus,
  todoListItemStatus,
} from '../models/todo-list-item.model';

@Component({
  standalone: true,
  selector: 'app-todo',
  template: `
    <div>
      {{ todo().title }}
      <button (click)="this.updateEvent.emit()">
        @if (todo().status === todoItemStatus.updating) {
          Updating...
        } @else {
          Update
        }
      </button>
      <button (click)="deleteEvent.emit()">
        @if (todo().status === todoItemStatus.deleting) {
          Deleting...
        } @else {
          Delete
        }
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  public todo = input.required<TodoListItemWithStatus>();
  public todoItemStatus = todoListItemStatus;
  public updateEvent = output();
  public deleteEvent = output();
}
