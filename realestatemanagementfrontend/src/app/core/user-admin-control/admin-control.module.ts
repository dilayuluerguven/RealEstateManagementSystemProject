import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { UpdateComponent } from './update/update.component';
import { UserAdminControlRoutingModule } from './admin-control-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    UpdateComponent
  ],
  exports:[ListComponent],  
  imports: [
    CommonModule,
    UserAdminControlRoutingModule,ReactiveFormsModule
  ]
})
export class UserAdminControlModule { }
