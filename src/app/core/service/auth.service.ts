import { Injectable, NgZone } from '@angular/core';
import { of, Observable, throwError, BehaviorSubject } from 'rxjs';

import { User } from '@data/schema/user';
import { environment } from '@env';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';


interface LoginContextInterface {
  username: string;
  password: string;
}

const defaultUser = {
  username: 'Mathis',
  password: '12345',
  token: '12345'
};

const AUTH_API = `${environment.host}/auth/`;

const httpOptions = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  token: string;

  api = {
    login: `${environment.host}/auth/login`
  };
  private userSubject: BehaviorSubject<User>;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  user: Observable<User>;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  userData: any; // Save logged in user data

  constructor(
    private http: HttpClient,
    private router: Router,
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public ngZone: NgZone // NgZone service to remove outside scope warning
    ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
    this.afAuth.authState.subscribe(user => {
      if (user) {
        console.log('user', user);
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  // Sign in with email/password
  async signIn(email: string, password: string) {
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
      this.ngZone.run(() => {
        this.router.navigate(['dashboard']);
      });
      this.setUserData(result.user);
    } catch (error) {
      window.alert(error.message);
    }
  }

  // Sign up with email/password
  async signUp(email: string, password: string) {
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
      /* Call the SendVerificaitonMail() function when new user sign
      up and returns promise */
      console.log('result', result);
      this.sendVerificationMail();
      this.setUserData(result.user);
    } catch (error) {
      window.alert(error.message);
    }
  }

   // Send email verfificaiton when new user sign up
   async sendVerificationMail() {
    await this.afAuth.auth.currentUser.sendEmailVerification();
    this.router.navigate(['/auth/verify-email-address']);
  }

  // Sign in with Google
  googleAuth() {
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  // Auth logic to run auth providers
  async authLogin(provider: auth.AuthProvider) {
    try {
      const result = await this.afAuth.auth.signInWithPopup(provider);
      this.ngZone.run(() => {
        this.router.navigate(['dashboard']);
      });
      this.setUserData(result.user);
    } catch (error) {
      window.alert(error);
    }
  }

    /* Setting up user data when sign in with username/password,
  sign up with username/password and sign in with social auth
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: any = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    return userRef.set(userData, {
      merge: true
    });
  }

  login(credentials: LoginContextInterface): Observable<User> {
    return this.http
      .post<User>(
        AUTH_API + 'login',
        {
          username: credentials.username,
          password: credentials.password
        },
        httpOptions
      )
      .pipe(
        map(res => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          const user: User = {
            username: credentials.username,
            password: credentials.password,
            token: res.token
          };
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }

  logout = () => {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/home']);
  };

}
