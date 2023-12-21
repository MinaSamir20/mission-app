import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListSchoolComponent } from './list-school/list-school.component';

const routes: Routes = [{ path: '', component: ListSchoolComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolRoutingModule { }
