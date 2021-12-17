import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { ThemeService } from '@core/service/theme.service';
import { environment } from '@env';
import { AuthService } from '@app/core/service/auth.service';
import { User } from '@app/data/schema/user';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {
  public version = environment.version;
  public repoUrl = 'https://github.com/mathisGarberg/angular-folder-structure';

  public isDarkTheme$: Observable<boolean>;
  label: string;
  subscription: Subscription = new Subscription();
  user: any;

  navItems = [
    { link: '/home', title: 'Home' },
    { link: '/about', title: 'Stock Rating' },
    { link: '/contact', title: 'Biểu đồ' }
  ];

  constructor(private themeService: ThemeService,
    public authService: AuthService,
    public afAuth: AngularFireAuth,) {
      this.subscription.add(this.afAuth.authState.subscribe(user => {
        this.user = user;
      }));
    }

  ngOnInit() {
    this.isDarkTheme$ = this.themeService.getDarkTheme();
    this.subscription.add(this.isDarkTheme$.subscribe((theme) => {
      this.label = theme ? 'Sáng' : 'Tối';
    }));
  }

  toggleTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }

  logout = () => {
    this.authService.signOut();

    console.log(this.authService.userValue);
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
