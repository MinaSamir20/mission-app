import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolRoutingModule } from './school-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { AddSchoolComponent } from './add-school/add-school.component';
import { ListSchoolComponent } from './list-school/list-school.component';


@NgModule({
  declarations: [
    AddSchoolComponent,
    ListSchoolComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SchoolRoutingModule,
    SharedModule,
    NgxPaginationModule,
  ]
})
export class SchoolModule { }
