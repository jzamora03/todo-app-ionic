import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private STORAGE_KEY = 'todos';
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  constructor() {
    this.load();
  }

  private load() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    this.todosSubject.next(saved ? JSON.parse(saved) : []);
  }

  private save(todos: Todo[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(todos));
    this.todosSubject.next(todos);
  }

  getAll(): Todo[] {
    return this.todosSubject.getValue();
  }

  getByCategory(categoryId: string | null): Todo[] {
    if (!categoryId) return this.getAll();
    return this.getAll().filter(t => t.categoryId === categoryId);
  }

  add(text: string, categoryId: string | null) {
    const todos = this.getAll();
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      categoryId,
      createdAt: new Date()
    };
    this.save([newTodo, ...todos]);
  }

  toggle(id: string) {
    const todos = this.getAll().map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    this.save(todos);
  }

  delete(id: string) {
    const todos = this.getAll().filter(t => t.id !== id);
    this.save(todos);
  }

  updateCategory(todoId: string, categoryId: string | null) {
    const todos = this.getAll().map(t =>
      t.id === todoId ? { ...t, categoryId } : t
    );
    this.save(todos);
  }
}