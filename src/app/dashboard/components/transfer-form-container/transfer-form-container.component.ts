import { Component, OnInit, OnDestroy } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

import { Transfer } from '../../shared/models/transfer';

@Component({
  selector: 'app-transfer-form-container',
  templateUrl: './transfer-form-container.component.html',
  styleUrls: ['./transfer-form-container.component.scss']
})
export class TransferFormContainerComponent implements OnInit, OnDestroy {

  public userBalance: number = 0;
  public userPrincipal: string = '';
  public amountToTransfer: number = 0;
  public targetPrincipal: string = '';
  private targetPrincipalPlaceholder = 'xxxx-xxxx-xxxx-xxx-xxx';

  constructor(
    private readonly dialogRef: DynamicDialogRef,
    private readonly dialogConfig: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    
    const { userBalance, userPrincipal } = this.dialogConfig.data;  

    this.userBalance = userBalance;
    this.userPrincipal = userPrincipal;
    this.amountToTransfer = 0;
    this.targetPrincipal = this.targetPrincipalPlaceholder;
  }

  ngOnDestroy(): void {
    
  }

  close(transfer: Transfer): void {

    this.dialogRef.close(transfer);
  }

  send(transfer: Partial<Transfer>): void {

    const foo : Transfer = {
      userPrincipal: this.userPrincipal,
      targetPrincipal: transfer.targetPrincipal as string,
      amountToTransfer: transfer.amountToTransfer as number,
    };

    this.close(foo);
  }

  updateAmountToTransfer(amount: number): void {

    this.amountToTransfer = amount;
  }

  updateTargetPrincipal(principal: string): void {

    this.targetPrincipal = principal || this.targetPrincipalPlaceholder;
  }
}
