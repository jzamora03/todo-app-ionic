import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { combineLatest } from 'rxjs';
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
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class HomePage implements OnInit {
  todos: Todo[] = [];
  categories: Category[] = [];
  filteredTodos: Todo[] = [];
  selectedCategoryId: string | null = null;
  newTodoText: string = '';
  selectedNewTodoCategoryId: string | null = null;


  constructor(
    private todoService: TodoService,
    private categoryService: CategoryService,
    private alertCtrl: AlertController,
    private cdr: ChangeDetectorRef,
    public remoteConfigService: RemoteConfigService
  ) { }

  showSwipeHint = false;

  ngOnInit() {
    combineLatest([
      this.todoService.todos$,
      this.categoryService.categories$
    ]).subscribe(([todos, categories]) => {
      this.todos = todos;
      this.categories = categories;
      this.applyFilter();
      this.cdr.markForCheck();
    });
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

      // Mostrar hint solo la primera vez
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

  // addTodo() {
  //   if (this.newTodoText.trim()) {
  //     this.todoService.add(this.newTodoText.trim(), this.selectedNewTodoCategoryId);
  //     this.newTodoText = '';
  //   }
  // }

  toggleTodo(todo: Todo) { this.todoService.toggle(todo.id); }
  deleteTodo(todo: Todo) { this.todoService.delete(todo.id); }

  getCategoryById(id: string | null): Category | undefined {
    return id ? this.categories.find(c => c.id === id) : undefined;
  }

  get completedCount(): number {
    return this.todos.filter(t => t.completed).length;
  }




  trackById(_: number, item: Todo) { return item.id; }
}