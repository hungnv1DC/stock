import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/core/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() { }
}
