import { Component, OnInit, OnDestroy } from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SubSink } from 'subsink';

import { WalletService } from '../../shared/services/wallet.service';
import { Transfer } from '../../shared/models/transfer';
import { TransferError} from '../../shared/errors/transfer-error';

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
  public isTransferInProgress: boolean = false;
  private targetPrincipalPlaceholder = 'xxxx-xxxx-xxxx-xxx-xxx';

  private subskink = new SubSink();

  constructor(
    private readonly dialogRef: DynamicDialogRef,
    private readonly dialogConfig: DynamicDialogConfig,
    private readonly wallet: WalletService
  ) { }

  ngOnInit(): void {
    
    const { userBalance, userPrincipal } = this.dialogConfig.data;  

    this.userBalance = userBalance;
    this.userPrincipal = userPrincipal;
    this.amountToTransfer = 0;
    this.targetPrincipal = this.targetPrincipalPlaceholder;
  }

  ngOnDestroy(): void {
    
    this.subskink.unsubscribe();
  }

  send(transfer: Partial<Transfer>): void {

    this.isTransferInProgress = true;

    this.subskink.sink = this.wallet.transfer(
      this.userPrincipal, 
      transfer.targetPrincipal as string,
      transfer.amountToTransfer as number).subscribe({
        next: (result) => {

          const { userPrincipal, targetPrincipal, amountToTransfer } = result;

          this.isTransferInProgress = false;
          this.close({ userPrincipal, targetPrincipal, amountToTransfer } as Transfer);
        },
        error: (err: TransferError) => {

          this.isTransferInProgress = false;
          this.close(err)
        }
      });
  }

  updateAmountToTransfer(amount: number): void {

    this.amountToTransfer = amount;
  }

  updateTargetPrincipal(principal: string): void {

    this.targetPrincipal = principal || this.targetPrincipalPlaceholder;
  }

  close(transfer: Transfer | TransferError): void {

    this.dialogRef.close(transfer);
  }
}
