export type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export type UpdateTodoDto = {
  id: number;
  body: string;
};
