import { NgModule } from '@angular/core';

import { LoginComponent } from './page/login/login.component';
import { RegisterComponent } from './page/register/register.component';

import { SharedModule } from '@shared/shared.module';
import { AuthRoutingModule } from './auth.routing';
import { VerifyEmailComponent } from './page/verify-email/verify-email.component';
import { NgxOtpInputModule } from 'ngx-otp-input';
import { NgxUploaderModule } from 'ngx-uploader';

@NgModule({
  declarations: [LoginComponent, RegisterComponent, VerifyEmailComponent],
  imports: [AuthRoutingModule, SharedModule, NgxOtpInputModule, NgxUploaderModule ]
})
export class AuthModule {}
