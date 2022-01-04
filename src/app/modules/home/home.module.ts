import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NgxMasonryModule } from 'ngx-masonry';
import { SharedModule } from '@shared/shared.module';

import { MyModalComponent } from './modal/my-modal.component';
import { HomeComponent } from './page/home.component';
import { ProjectItemComponent } from './page/project-item/project-item.component';
import { ProjectDetailsComponent } from './page/project-details/project-details.component';

import { HomeRoutingModule } from './home.routing';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    HomeComponent,
    MyModalComponent,
    ProjectItemComponent,
    ProjectDetailsComponent
  ],
  imports: [SharedModule, NgxMasonryModule, HomeRoutingModule, NgxSpinnerModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  exports: [],
  providers: [DatePipe],
  entryComponents: [MyModalComponent]
})
export class HomeModule {}
