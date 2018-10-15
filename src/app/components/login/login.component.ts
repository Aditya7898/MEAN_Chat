import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showSpinner = false;
  errorMsg: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.init();
  }
  init() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    this.showSpinner = true;
    this.authService.login(this.loginForm.value).subscribe(
      res => {
        this.loginForm.reset();
        this.tokenService.setToken(res.token);
        console.log(res.token);
        setTimeout(() => {
          this.router.navigate(['/streams']);
        }, 3000);
      },
      err => {
        this.showSpinner = false;
        if (err.error.message) {
          this.errorMsg = err.error.message;
        }
      }
    );
  }
}
