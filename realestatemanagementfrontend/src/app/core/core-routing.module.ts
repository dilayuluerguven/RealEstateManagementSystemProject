import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UpdateComponent } from './user-admin-control/update/update.component';
import { AddComponent } from './user-admin-control/add/add.component';
import { AdminGuard } from './guards/admin.guard';
import { UserGuard } from './guards/user.guard';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    canActivate:[UserGuard],
    canActivateChild:[UserGuard],
    children: [
      {
        path: '',
        redirectTo: 'tasinmaz',
        pathMatch: 'full',
      },
      {
        path: 'tasinmaz',
        loadChildren: () =>
          import('./tasinmaz/tasinmaz.module').then((m) => m.TasinmazModule),
      },
    ],
  },

  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AdminGuard],
    canActivateChild:[AdminGuard],
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./user-admin-control/admin-control.module').then(
            (m) => m.UserAdminControlModule
          ),
      },
      {
        path: 'tasinmaz',
        loadChildren: () =>
          import('./tasinmaz/tasinmaz.module').then((m) => m.TasinmazModule),
      },
      {
        path: '',
        redirectTo: 'tasinmaz',
        pathMatch: 'full',
      },
      {
        path: 'update/:id',
        component: UpdateComponent,
      },
      {
        path: 'add',
        component: AddComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
