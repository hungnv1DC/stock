import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { ThemeService } from '@core/service/theme.service';
import { environment } from '@env';
import { AuthService } from '@app/core/service/auth.service';
import { User } from '@app/data/schema/user';

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
  user: User;

  navItems = [
    { link: '/home', title: 'Home' },
    { link: '/about', title: 'Stock Rating' },
    { link: '/contact', title: 'Biểu đồ' }
  ];

  constructor(private themeService: ThemeService,
    private authService: AuthService) {
      this.user = this.authService.userValue;
      console.log('userData', this.authService.userData);
    }

  ngOnInit() {
    console.log(this.user);
    this.isDarkTheme$ = this.themeService.getDarkTheme();
    this.subscription.add(this.isDarkTheme$.subscribe((theme) => {
      this.label = theme ? 'Sáng' : 'Tối';
    }));
  }

  toggleTheme(checked: boolean) {
    this.themeService.setDarkTheme(checked);
  }

  logout = () => {
    this.authService.logout();
    this.user = this.authService.userValue;

    console.log(this.authService.userValue);
  };

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
