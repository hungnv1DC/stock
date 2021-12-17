import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from '@app/shared/pipe/safe.pipe';

import { SharedModule } from '@shared/shared.module';
import { contactRoutes } from './contact-routing.module';
import { ContactComponent } from './page/contact/contact.component';

@NgModule({
  declarations: [ContactComponent, SafeHtmlPipe],
  imports: [contactRoutes, SharedModule]
})
export class ContactModule {}
