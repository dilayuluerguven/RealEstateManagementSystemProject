import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlanAnaliziRoutingModule } from './alan-analizi-routing.module';
import { AlanAnalizComponent } from './components/alan-analizi/alan-analizi.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AlanAnalizComponent
  ],
  imports: [
    CommonModule,
    AlanAnaliziRoutingModule,
    FormsModule
  ]
})
export class AlanAnaliziModule { }
