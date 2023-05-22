import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';

import { authenticateGuard } from '@app/auth/shared/guards/authenticate.guard';

const routes: Routes = [
  { path: '', component: DashboardPageComponent, canActivate: [authenticateGuard] }
  // { path: '', component: DashboardPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
