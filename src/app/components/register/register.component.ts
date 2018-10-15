import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errorMsg: string;
  showSpinner = false;

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
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required]
    });
  }

  register() {
    console.log(this.registerForm.value);
    this.showSpinner = true;
    this.authService.register(this.registerForm.value).subscribe(
      user => {
        this.tokenService.setToken(user.token);
        this.registerForm.reset();
        setTimeout(() => {
          this.router.navigate(['/streams']);
        }, 3000);
      },
      err => {
        this.showSpinner = false;
        if (err.error.msg) {
          this.errorMsg = err.error.msg[0].message;
        }
        if (err.error.message) {
          this.errorMsg = err.error.message;
        }
      }
    );
  }
}
