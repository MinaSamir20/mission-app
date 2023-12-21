import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { ListCategoryComponent } from './components/list-category/list-category.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { ManageUsersRoutingModule } from '../manage-users/manage-users-routing.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [AddCategoryComponent, ListCategoryComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ManageUsersRoutingModule,
    NgxPaginationModule,
    SharedModule,
  ],
})
export class CategoryModule {}
