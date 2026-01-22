import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreRoutingModule } from './core-routing.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [AdminLayoutComponent, UserLayoutComponent,ProfileComponent],
  imports: [CommonModule, CoreRoutingModule, RouterModule,HttpClientModule,FormsModule,ReactiveFormsModule],
  
})
export class CoreModule {}
