import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { RouterModule } from '@angular/router';
import { TasinmazMapComponent } from './map/tasinmaz-map/tasinmaz-map.component';
import { TasinmazListMapComponent } from './map/tasinmaz-list-map/tasinmaz-list-map.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [AdminLayoutComponent, UserLayoutComponent, TasinmazMapComponent, TasinmazListMapComponent, ProfileComponent],
  imports: [CommonModule, CoreRoutingModule, RouterModule,HttpClientModule,FormsModule],
  exports:[TasinmazMapComponent,TasinmazListMapComponent]
})
export class CoreModule {}
