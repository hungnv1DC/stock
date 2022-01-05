import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';

import { ToolComponent } from './page/tool/tool.component';
import { ToolRoutingModule } from './tool-routing.module';

@NgModule({
  declarations: [ToolComponent],
  imports: [ToolRoutingModule, SharedModule]
})
export class ToolModule {}
