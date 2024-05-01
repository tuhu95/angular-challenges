import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Todo, UpdateTodoDto } from '../model/todo.model';

@Injectable()
export class TodoService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/todos';
  private readonly http = inject(HttpClient);

  public getTodos() {
    return this.http.get<Todo[]>(this.baseUrl);
  }
  public updateTodo(todo: UpdateTodoDto) {
    return this.http.put<Todo>(`${this.baseUrl}/${todo.id}`, todo.body, {
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
  }
}
