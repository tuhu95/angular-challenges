import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Subject, concatMap } from 'rxjs';
import { UpdateTodoDto } from '../model/todo.model';
import { TodoService } from './todo.service';
@Injectable()
export class TodoStore {
  private readonly todoService = inject(TodoService);

  // Sources
  public todosState = toSignal(this.todoService.getTodos(), {
    initialValue: [],
  });
  // Actions
  public updateTodoAction = new Subject<UpdateTodoDto>();

  constructor() {
    this.updateTodoAction
      .pipe(
        concatMap((todo) => this.todoService.updateTodo(todo)),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
