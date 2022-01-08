import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { QuillModule } from 'ngx-quill';
import { BrokerRoutingModule } from './broker-routing.module';

import { BrokerComponent } from './page/broker/broker.component';
import { NgxCurrencyModule } from 'ngx-currency';
import { DialogBrokerComponent } from './modal/dialog-broker/dialog-broker.component';
import { MatDialogModule } from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [BrokerComponent, DialogBrokerComponent],
  imports: [BrokerRoutingModule, SharedModule, QuillModule.forRoot(), NgxCurrencyModule,
    MatDialogModule, MatProgressBarModule
  ],
  entryComponents: [DialogBrokerComponent]

})
export class BrokerModule {}
