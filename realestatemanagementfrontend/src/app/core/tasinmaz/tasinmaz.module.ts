import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasinmazRoutingModule } from './tasinmaz-routing.module';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import { UpdateComponent } from './update/update.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../core.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    AddComponent,
    ListComponent,
    UpdateComponent
  ],
  imports: [
    CommonModule,
    TasinmazRoutingModule,ReactiveFormsModule,SharedModule,FormsModule,SharedModule
  ]
})
export class TasinmazModule { }
