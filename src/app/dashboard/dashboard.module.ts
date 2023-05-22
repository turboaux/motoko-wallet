import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { TransferFormComponent } from './components/transfer-form/transfer-form.component';
import { TransferFormContainerComponent } from './components/transfer-form-container/transfer-form-container.component';


@NgModule({
  declarations: [
    DashboardPageComponent,
    TransferFormComponent,
    TransferFormContainerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    TableModule,
    ToastModule,
    TooltipModule,
    DynamicDialogModule,
    DashboardRoutingModule
  ],
  providers: [ DialogService, MessageService ]
})
export class DashboardModule { }
