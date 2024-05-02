export type TodoDto = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export type Todo = TodoDto & {
  isLoading: boolean;
};

export type UpdateTodoDto = {
  id: number;
  body: string;
};
