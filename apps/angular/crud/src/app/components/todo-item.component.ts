import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
      @if (errorMessage()) {
        {{ errorMessage() }}
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItemComponent {
  public todo = input.required<TodoListItemWithStatus>();
  public todoItemStatus = todoListItemStatus;
  public errorMessage = computed(() => {
    const errorStatus = this.todo().status;
    return typeof errorStatus === 'object' ? errorStatus.error : null;
  });
  public updateEvent = output();
  public deleteEvent = output();
}
