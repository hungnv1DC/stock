import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {TraderComponent } from './page/trader/trader.component';

const routes: Routes = [
  {
    path: '',
    component: TraderComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TraderRoutingModule { }
