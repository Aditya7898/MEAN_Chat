import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  response: any;
  responseError: any;

  constructor(private fb: FormBuilder, private userService: UsersService) {}

  ngOnInit() {
    this.init();
  }

  init() {
    this.passwordForm = this.fb.group(
      {
        cpassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]]
      },
      {
        validator: this.validate.bind(this)
      }
    );
  }

  changePassword() {
    console.log(this.passwordForm.value);
    this.userService.ChangePassword(this.passwordForm.value).subscribe(
      data => {
        console.log(data);
        this.response = data;
      },
      err => {
        console.log(err);
        this.responseError = err.error.message[0].message;
      }
    );
  }

  validate(passwordFormGroup: FormGroup) {
    const new_password = passwordFormGroup.controls.newPassword.value;
    const confirm_password = passwordFormGroup.controls.confirmPassword.value;

    if (confirm_password.length <= 0) {
      return null;
    }
    if (confirm_password !== new_password) {
      return { doesNotMatch: true };
    }

    return null;
  }
}
