import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: 'category-form.page.html',
  styleUrls: ['category-form.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, RouterModule],
})
export class CategoryFormPage implements OnInit {
  categoryId: string | null = null;
  name: string = '';
  color: string = '#3880ff';
  isEditing: boolean = false;

  colors = [
    '#3880ff', '#eb445a', '#2dd36f',
    '#ffc409', '#92949c', '#9b59b6',
    '#e67e22', '#1abc9c'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoryId = this.route.snapshot.paramMap.get('id');
    if (this.categoryId) {
      this.isEditing = true;
      const cat = this.categoryService.getById(this.categoryId);
      if (cat) { this.name = cat.name; this.color = cat.color; }
    }
  }

  save() {
    if (!this.name.trim()) return;
    if (this.isEditing && this.categoryId) {
      this.categoryService.update(this.categoryId, this.name.trim(), this.color);
    } else {
      this.categoryService.add(this.name.trim(), this.color);
    }
    this.router.navigate(['/categories']);
  }
}