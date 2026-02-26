import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private STORAGE_KEY = 'categories';
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  categories$ = this.categoriesSubject.asObservable();

  constructor() {
    this.load();
  }

  private load() {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    const data: Category[] = saved ? JSON.parse(saved) : [
      { id: '1', name: 'Personal', color: '#3880ff', createdAt: new Date() },
      { id: '2', name: 'Trabajo', color: '#eb445a', createdAt: new Date() },
    ];
    this.categoriesSubject.next(data);
  }

  private save(categories: Category[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(categories));
    this.categoriesSubject.next(categories);
  }

  getAll(): Category[] {
    return this.categoriesSubject.getValue();
  }

  getById(id: string): Category | undefined {
    return this.getAll().find(c => c.id === id);
  }

  add(name: string, color: string) {
    const categories = this.getAll();
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color,
      createdAt: new Date()
    };
    this.save([...categories, newCategory]);
  }

  update(id: string, name: string, color: string) {
    const categories = this.getAll().map(c =>
      c.id === id ? { ...c, name, color } : c
    );
    this.save(categories);
  }

  delete(id: string) {
    const categories = this.getAll().filter(c => c.id !== id);
    this.save(categories);
  }
}