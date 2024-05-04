import { Injectable, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, concatMap, tap } from 'rxjs';
import { Todo, UpdateTodoDto } from '../model/todo.model';
import { TodoService } from './todo.service';

export type TodoState = {
  isInitialized: boolean;
  data: Todo[];
};
@Injectable()
export class TodoStore {
  private readonly todoService = inject(TodoService);

  // Sources
  public state = signal<TodoState>({
    isInitialized: true,
    data: [],
  });
  // Actions
  public updateTodoAction = new Subject<UpdateTodoDto>();
  public deleteTodoAction = new Subject<number>();

  constructor() {
    this.todoService
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe((todos) => {
        this.state.set({
          isInitialized: true,
          data: todos,
        });
      });

    this.updateTodoAction
      .pipe(
        // Then call api to update the selected todo
        concatMap((todo) => this.todoService.update(todo)),
        // Finally update the selected todo in state
        tap((updatedTodo) => {
          this.state.update((state) => ({
            ...state,
            data: state.data.map((todo) =>
              todo.id === updatedTodo.id ? updatedTodo : todo,
            ),
          }));
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
    this.deleteTodoAction
      .pipe(
        concatMap((id) => this.todoService.delete(id)),
        tap((deletedTodoId) => {
          this.state.update((state) => ({
            ...state,
            data: state.data.filter((todo) => todo.id !== deletedTodoId),
          }));
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
