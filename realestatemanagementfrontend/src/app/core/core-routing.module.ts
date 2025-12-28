import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UpdateComponent } from './user-admin-control/update/update.component';
import { AddComponent } from './user-admin-control/add/add.component';

const routes: Routes = [
  // USER
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'tasinmaz',
        pathMatch: 'full',
      },
      {
        path: 'tasinmaz',
        loadChildren: () =>
          import('./tasinmaz/tasinmaz.module').then(m => m.TasinmazModule),
      },
    ],
  },

  // ADMIN
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./user-admin-control/admin-control.module')
            .then(m => m.UserAdminControlModule),
      },
      {
        path: 'tasinmaz',
        loadChildren: () =>
          import('./tasinmaz/tasinmaz.module').then(m => m.TasinmazModule),
      },
      {
        path:'update/:id',component:UpdateComponent
      },
      {
        path:'add',component:AddComponent
      }
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
