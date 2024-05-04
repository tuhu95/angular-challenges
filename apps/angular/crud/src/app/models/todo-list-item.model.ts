export type ObjectKey<T> = T[keyof T];

export type TodoListItem = {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
};

export const todoListItemStatus = {
  idle: 'idle',
  loading: 'loading',
  updating: 'updating',
  deleting: 'deleting',
} as const;

export type TodoListItemStatus =
  | ObjectKey<typeof todoListItemStatus>
  | { error: string };

export type TodoListItemWithStatus = TodoListItem & {
  status: TodoListItemStatus;
};
