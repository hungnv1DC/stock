import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BrokerComponent } from './page/broker/broker.component';

const routes: Routes = [
  {
    path: '',
    component: BrokerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrokerRoutingModule { }
