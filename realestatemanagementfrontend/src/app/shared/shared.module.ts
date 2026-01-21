import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TasinmazMapComponent } from './tasinmaz-map/tasinmaz-map.component';
import { TasinmazListMapComponent } from './tasinmaz-list-map/tasinmaz-list-map.component';
import { FormsModule } from '@angular/forms';
import { MapControlsComponent } from './components/map-controls/map-controls/map-controls.component';
import { ImageUploaderComponent } from './components/image-uploader/image-uploader.component';



@NgModule({
  declarations: [
    TasinmazMapComponent,
    TasinmazListMapComponent,
    MapControlsComponent,
    ImageUploaderComponent
  ],
  imports: [
    CommonModule,FormsModule
  ],
  exports: [
    TasinmazMapComponent,
    TasinmazListMapComponent,
    ImageUploaderComponent
  ]
})
export class SharedModule {}

