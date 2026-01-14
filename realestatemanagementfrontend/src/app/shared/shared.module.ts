import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasinmazMapComponent } from './tasinmaz-map/tasinmaz-map.component';
import { TasinmazListMapComponent } from './tasinmaz-list-map/tasinmaz-list-map.component';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    TasinmazMapComponent,
    TasinmazListMapComponent
  ],
  imports: [
    CommonModule,FormsModule
  ],
  exports: [
    TasinmazMapComponent,
    TasinmazListMapComponent
  ]
})
export class SharedModule {}

