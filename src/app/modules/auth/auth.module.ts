import { NgModule } from '@angular/core';

import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';

import { SharedModule } from '@shared/shared.module';
import { AuthRoutingModule } from './auth.routing';
import { VerifyEmailComponent } from './page/verify-email/verify-email.component';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, VerifyEmailComponent],
  imports: [AuthRoutingModule, SharedModule]
})
export class AuthModule {}
