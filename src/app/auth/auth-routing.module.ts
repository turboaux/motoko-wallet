import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginPageComponent } from './pages/login-page/login-page.component';
import { TestPageComponent } from './pages/test-page/test-page.component';

import { redirectIfAuthenticatedGuard } from './shared/guards/redirect-if-authenticated.guard';

const routes: Routes = [
  // { path: 'login', component: LoginPageComponent, canActivate: [redirectIfAuthenticatedGuard] },
  { path: 'login', component: LoginPageComponent },
  { path: 'test', component: TestPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
