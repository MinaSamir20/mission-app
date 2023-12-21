import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from '../auth/auth.gard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'main',
        loadChildren: () =>
          import('./main-page/main-page.module').then((m) => m.MainPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'mainpage',
        loadChildren: () =>
          import('./main-page/main-page.module').then((m) => m.MainPageModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./category/category.module').then((m) => m.CategoryModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'tasks',
        loadChildren: () =>
          import('./tasks-admin/tasks-admin.module').then(
            (m) => m.TasksAdminModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./manage-users/manage-users.module').then(
            (m) => m.ManageUsersModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'schools',
        loadChildren: () =>
          import('./school/school.module').then((m) => m.SchoolModule),
        canActivate: [AuthGuard],
      },
      // Wildcard route - should be the last route
      { path: '**', redirectTo: '/' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
