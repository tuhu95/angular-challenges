import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Todo, TodoDto, UpdateTodoDto } from '../model/todo.model';

@Injectable()
export class TodoService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/todos';
  private readonly http = inject(HttpClient);

  public getTodos(): Observable<Todo[]> {
    return this.http
      .get<TodoDto[]>(this.baseUrl)
      .pipe(
        map((todos) => todos.map((todo) => ({ ...todo, isLoading: false }))),
      );
  }
  public updateTodo(todo: UpdateTodoDto): Observable<Todo> {
    return this.http
      .put<TodoDto>(`${this.baseUrl}/${todo.id}`, todo.body, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .pipe(map((todo) => ({ ...todo, isLoading: false })));
  }
}
