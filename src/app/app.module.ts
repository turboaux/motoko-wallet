import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DashboardModule } from './dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthService } from './auth/shared/services/auth.service';
import { authClientInit } from './auth-client-init';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AuthModule,
    DashboardModule,
    AppRoutingModule
  ],
  providers: [{ provide: APP_INITIALIZER, useFactory: authClientInit, deps: [AuthService], multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
