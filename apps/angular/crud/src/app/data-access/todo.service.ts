import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  TodoListItem,
  TodoListItemWithStatus,
} from '../models/todo-list-item.model';

@Injectable()
export class TodoService {
  private readonly baseUrl = 'https://jsonplaceholder.typicode.com/todos';
  private readonly http = inject(HttpClient);

  public getAll(): Observable<TodoListItemWithStatus[]> {
    return this.http
      .get<TodoListItem[]>(this.baseUrl)
      .pipe(map((todos) => todos.map((todo) => ({ ...todo, status: 'idle' }))));
  }
  public update(
    id: number,
    todo: Partial<Omit<TodoListItem, 'id'>>,
  ): Observable<TodoListItemWithStatus> {
    return this.http
      .put<TodoListItem>(`${this.baseUrl}/${id}`, todo, {
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      })
      .pipe(map((todo) => ({ ...todo, status: 'idle' })));
  }
  public delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(map(() => id));
  }
}
