import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-categories',
  templateUrl: 'categories.page.html',
  styleUrls: ['categories.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesPage implements OnInit {
  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private alertCtrl: AlertController,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.categoryService.categories$.subscribe(cats => {
      this.categories = cats;
      this.cdr.markForCheck();
    });
  }

  addCategory() { this.router.navigate(['/category-form']); }
  editCategory(cat: Category) { this.router.navigate(['/category-form', { id: cat.id }]); }

  async deleteCategory(cat: Category) {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar categoría',
      message: `¿Seguro que deseas eliminar "${cat.name}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.categoryService.delete(cat.id) }
      ]
    });
    await alert.present();
  }

  trackById(_: number, item: Category) { return item.id; }
}