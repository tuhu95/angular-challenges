import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Todo } from '@ngneat/falso';
import { tapResponse } from '@ngrx/operators';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import {
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { concatMap, pipe, switchMap, tap } from 'rxjs';
import {
  TodoListItemWithStatus,
  todoListItemStatus,
} from '../models/todo-list-item.model';
import {
  setFulfilled,
  setLoading,
  withTodoListStatus,
} from './features/todo-list-status.feature';
import { TodoService } from './todo.service';

export const TodoListStore = signalStore(
  withEntities<TodoListItemWithStatus>(),
  withTodoListStatus(),
  withMethods((store) => {
    const todoService = inject(TodoService);
    const getAll = rxMethod<void>(
      pipe(
        tap(() => patchState(store, setLoading())),
        switchMap(() => todoService.getAll()),
        tap((todos) =>
          patchState(store, setAllEntities(todos), setFulfilled()),
        ),
      ),
    );
    const update = rxMethod<{ id: number; todo: Partial<Omit<Todo, 'id'>> }>(
      pipe(
        tap(({ id }) =>
          patchState(
            store,
            updateEntity({
              id,
              changes: { status: todoListItemStatus.updating },
            }),
          ),
        ),
        concatMap(({ id, todo }) =>
          todoService.update(id, todo).pipe(
            tapResponse({
              next: (updatedTodo) =>
                patchState(
                  store,
                  updateEntity({
                    id,
                    changes: {
                      ...updatedTodo,
                      status: todoListItemStatus.idle,
                    },
                  }),
                ),
              error: (error: HttpErrorResponse) => {
                console.error(error);
                patchState(
                  store,
                  updateEntity({
                    id,
                    changes: {
                      status: {
                        error:
                          typeof error === 'string' ? error : error.message,
                      },
                    },
                  }),
                );
              },
            }),
          ),
        ),
      ),
    );
    const remove = rxMethod<{ id: number }>(
      pipe(
        tap(({ id }) =>
          patchState(
            store,
            updateEntity({
              id,
              changes: { status: todoListItemStatus.deleting },
            }),
          ),
        ),
        concatMap(({ id }) =>
          todoService.delete(id).pipe(
            tapResponse({
              next: (deletedId) => patchState(store, removeEntity(deletedId)),
              error: (error: HttpErrorResponse) => {
                console.error(error);
                patchState(
                  store,
                  updateEntity({
                    id,
                    changes: {
                      status: {
                        error:
                          typeof error === 'string' ? error : error.message,
                      },
                    },
                  }),
                );
              },
            }),
          ),
        ),
      ),
    );
    return {
      getAll,
      update,
      remove,
    };
  }),
  withHooks({
    onInit(store) {
      store.getAll();
    },
  }),
);
