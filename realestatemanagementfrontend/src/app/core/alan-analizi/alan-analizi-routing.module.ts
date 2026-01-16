import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlanAnaliziComponent } from './components/alan-analizi/alan-analizi.component';

const routes: Routes = [
  { path: '', component: AlanAnaliziComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlanAnaliziRoutingModule {}
