import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { TestPageComponent } from './pages/test-page/test-page.component';

@NgModule({
  declarations: [
    LoginPageComponent,
    TestPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    AuthRoutingModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AuthModule { }
