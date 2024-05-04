import { computed } from '@angular/core';
import { signalStoreFeature, withComputed, withState } from '@ngrx/signals';

export type ObjectKey<T> = T[keyof T];

export const todoListStatus = {
  loading: 'loading',
  fulfilled: 'fulfilled',
} as const;

export type TodoStatus = ObjectKey<typeof todoListStatus> | { error: string };

export type TodoListStatus = { status: TodoStatus };

export function withTodoListStatus() {
  return signalStoreFeature(
    withState<TodoListStatus>({ status: todoListStatus.loading }),
    withComputed(({ status }) => ({
      isLoading: computed(() => status() === todoListStatus.loading),
      isFulfilled: computed(() => status() === todoListStatus.fulfilled),
      error: computed(() => {
        const errorStatus = status();
        return typeof errorStatus === 'object' ? errorStatus.error : null;
      }),
    })),
  );
}

export function setLoading(): TodoListStatus {
  return { status: todoListStatus.loading };
}

export function setFulfilled(): TodoListStatus {
  return { status: todoListStatus.fulfilled };
}

export function setError(error: string): TodoListStatus {
  return { status: { error } };
}
