import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthTabsComponent } from '../components/auth-tabs/auth-tabs.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  declarations: [AuthTabsComponent, LoginComponent, RegisterComponent],
  exports: [AuthTabsComponent, LoginComponent, RegisterComponent],
  providers: [AuthService]
})
export class AuthModule {}
