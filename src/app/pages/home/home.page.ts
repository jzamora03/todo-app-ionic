import {
  Component, OnInit, OnDestroy,
  ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TodoService } from '../../services/todo.service';
import { CategoryService } from '../../services/category.service';
import { Todo } from '../../models/todo.model';
import { Category } from '../../models/category.model';
import { RemoteConfigService } from 'src/app/services/remote-config.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage implements OnInit, OnDestroy {
  todos: Todo[] = [];
  categories: Category[] = [];
  filteredTodos: Todo[] = [];
  selectedCategoryId: string | null = null;
  newTodoText: string = '';
  selectedNewTodoCategoryId: string | null = null;
  showSwipeHint = false;

  // Subject para limpiar subscripciones y evitar memory leaks
  private destroy$ = new Subject<void>();

  constructor(
    private todoService: TodoService,
    private categoryService: CategoryService,
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef,
    public remoteConfigService: RemoteConfigService
  ) {}

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'buenos días ☀️';
    if (hour < 18) return 'buenas tardes 🌤️';
    return 'buenas noches 🌙';
  }

  get completedCount(): number {
    return this.todos.filter(t => t.completed).length;
  }

  ngOnInit() {
    combineLatest([
      this.todoService.todos$,
      this.categoryService.categories$
    ])
    .pipe(takeUntil(this.destroy$)) // evita memory leaks
    .subscribe(([todos, categories]) => {
      this.todos = todos;
      this.categories = categories;
      this.applyFilter();
      this.cdr.markForCheck();
    });
  }

  // Limpia subscripciones al destruir el componente
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  applyFilter() {
    this.filteredTodos = !this.selectedCategoryId
      ? this.todos
      : this.todos.filter(t => t.categoryId === this.selectedCategoryId);
  }

  filterBy(categoryId: string | null) {
    this.selectedCategoryId = categoryId;
    this.applyFilter();
  }

  addTodo() {
    if (this.newTodoText.trim()) {
      this.todoService.add(this.newTodoText.trim(), this.selectedNewTodoCategoryId);
      this.newTodoText = '';

      // Mostrar hint solo la primera vez que se agrega una tarea
      const hintShown = localStorage.getItem('swipe_hint_shown');
      if (!hintShown && this.todos.length === 1) {
        setTimeout(() => {
          this.showSwipeHint = true;
          this.cdr.markForCheck();
        }, 600);
      }
    }
  }

  dismissHint() {
    this.showSwipeHint = false;
    localStorage.setItem('swipe_hint_shown', 'true');
    this.cdr.markForCheck();
  }

  toggleTodo(todo: Todo) {
    this.todoService.toggle(todo.id);
  }

  async deleteTodo(todo: Todo) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar tarea',
      message: `¿Deseas eliminar "${todo.text}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.todoService.delete(todo.id)
        }
      ]
    });
    await alert.present();
  }

  getCategoryById(id: string | null): Category | undefined {
    return id ? this.categories.find(c => c.id === id) : undefined;
  }

  // trackBy evita re-creación innecesaria de elementos del DOM
  trackById(_: number, item: Todo) {
    return item.id;
  }
}