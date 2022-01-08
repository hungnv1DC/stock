import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { QuillModule } from 'ngx-quill';

import { TraderComponent } from './page/trader/trader.component';
import { TraderRoutingModule } from './trader-routing.module';

@NgModule({
  declarations: [TraderComponent],
  imports: [TraderRoutingModule, SharedModule, QuillModule.forRoot()
  ]
})
export class TraderModule {}
