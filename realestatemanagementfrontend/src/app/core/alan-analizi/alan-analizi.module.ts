import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlanAnaliziRoutingModule } from './alan-analizi-routing.module';
import { AlanAnaliziComponent } from './components/alan-analizi/alan-analizi.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AlanAnaliziComponent
  ],
  imports: [
    CommonModule,
    AlanAnaliziRoutingModule,
    FormsModule
  ]
})
export class AlanAnaliziModule { }
