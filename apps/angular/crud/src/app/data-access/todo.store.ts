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

  constructor() {
    this.todoService
      .getTodos()
      .pipe(takeUntilDestroyed())
      .subscribe((todos) => {
        this.state.set({
          isInitialized: true,
          data: todos,
        });
      });

    this.updateTodoAction
      .pipe(
        // First update the loading state of selected todo
        tap((updatedTodo) => {
          this.state.update((state) => ({
            ...state,
            data: state.data.map((todo) =>
              todo.id === updatedTodo.id ? { ...todo, isLoading: true } : todo,
            ),
          }));
        }),
        // Then call api to update the selected todo
        concatMap((todo) => this.todoService.updateTodo(todo)),
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
  }
}
