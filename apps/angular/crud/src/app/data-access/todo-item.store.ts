import { Todo } from '@ngneat/falso';
import { signalState, signalStore, withState } from '@ngrx/signals';

export type TodoItemState = {
  todo: Todo | null;
  isUpdating: boolean;
  isDeleting: boolean;
  error: string | null;
};
const initialState = signalState<TodoItemState>({
  todo: null,
  isUpdating: false,
  isDeleting: false,
  error: null,
});

export const TodoItemStore = signalStore(withState(initialState));
