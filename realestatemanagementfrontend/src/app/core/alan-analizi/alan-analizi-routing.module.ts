import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlanAnalizComponent } from './components/alan-analizi/alan-analizi.component';



const routes: Routes = [
  { path: '', component:AlanAnalizComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlanAnaliziRoutingModule {}
