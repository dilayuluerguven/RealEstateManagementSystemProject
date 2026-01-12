import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasinmazRoutingModule } from './tasinmaz-routing.module';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core.module';


@NgModule({
  declarations: [
    AddComponent,
    ListComponent,
    UpdateComponent
  ],
  imports: [
    CommonModule,
    TasinmazRoutingModule,ReactiveFormsModule,CoreModule
  ]
})
export class TasinmazModule { }
