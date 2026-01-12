import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { RouterModule } from '@angular/router';
import { TasinmazMapComponent } from './map/tasinmaz-map/tasinmaz-map.component';

@NgModule({
  declarations: [AdminLayoutComponent, UserLayoutComponent, TasinmazMapComponent],
  imports: [CommonModule, CoreRoutingModule, RouterModule],
  exports:[TasinmazMapComponent]
})
export class CoreModule {}
