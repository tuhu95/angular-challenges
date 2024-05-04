import { inject } from '@angular/core';
import { Todo } from '@ngneat/falso';
import { patchState, signalStore, withHooks, withMethods } from '@ngrx/signals';
import {
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
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
        switchMap(({ id, todo }) => todoService.update(id, todo)),
        tap((updatedTodo) =>
          patchState(
            store,
            updateEntity({
              id: updatedTodo.id,
              changes: { ...updatedTodo, status: todoListItemStatus.idle },
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
        switchMap(({ id }) => todoService.delete(id)),
        tap((deletedId) => patchState(store, removeEntity(deletedId))),
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
