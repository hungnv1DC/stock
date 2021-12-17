/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit, OnDestroy, AfterViewInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { tap, delay, finalize, catchError } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

import { AuthService } from '@core/service/auth.service';
import * as firebase from 'firebase';
import { DOCUMENT } from '@angular/common';
import { NgxOtpInputConfig } from 'ngx-otp-input';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  error: string;
  isLoading: boolean;
  loginForm: FormGroup;

  email: string;
  password: string;
  signInMode = false;
  phoneNumber: string;
  otp: string;
  phoneSignIn = false;

  private sub = new Subscription();
  // eslint-disable-next-line @typescript-eslint/member-ordering
  recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  disableSignUpBtn = true;
  window: any;
  otpInputConfig: NgxOtpInputConfig = {
    otpLength: 6,
    autofocus: true,
    classList: {
      inputBox: 'my-super-box-class',
      input: 'my-super-class',
      inputFilled: 'my-super-filled-class',
      inputDisabled: 'my-super-disable-class',
      inputSuccess: 'my-super-success-class',
      inputError: 'my-super-error-class'
    }
  };
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public authService: AuthService,
    private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document

  ) {
    this.window = this.document.defaultView;
    this.buildForm();
  }

  ngOnInit() {
  }

  get f() {
    return this.loginForm.controls;
  }

  login() {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';

    this.isLoading = true;

    const credentials = this.loginForm.value;

    this.sub = this.authService
      .login(credentials)
      .pipe(
        delay(1500),
        tap(() => this.router.navigate([returnUrl])),
        finalize(() => (this.isLoading = false)),
        catchError(error => of((this.error = error?.error?.msg))),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  private buildForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  loginInPhone(phone: string) {
    this.authService.signInPhone(phone, this.recaptchaVerifier);

  }

  handeOtpChange(value: string[]): void {
    console.log('11',value);
  }

  handleFillEvent(value: string): void {
    console.log('22',value);
    if (value) {
      this.authService.signInPhoneVerify(value);
    }
  }

  ngAfterViewInit() {
    const captchaElement = document.getElementById('recaptcha-container');
    if (captchaElement != null) {
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container',
          {
             size: 'invisible',
             callback: () => {
                this.disableSignUpBtn = false;
             }
          });
      this.window.recaptchaVerifier = this.recaptchaVerifier;
      this.window.recaptchaVerifier.render();
    }
  }
}
