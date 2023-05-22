import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

import { TransferFormContainerComponent } from '../../components/transfer-form-container/transfer-form-container.component';
import { AuthService } from '@app/auth/shared/services/auth.service';
import { WalletService } from '../../shared/services/wallet.service';
import { Transaction } from '../../shared/models/transaction';
import { Transfer } from '../../shared/models/transfer';
import { TransferError } from '../../shared/errors/transfer-error';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  public isWalletInfoLoaded: boolean = false;
  public userBalance: number = 0;
  public userPrincipal: string = '';
  public logBook: Transaction[] = [];

  private subskink = new SubSink();

  constructor(
    private readonly router: Router,
    private readonly dialog: DialogService,
    private readonly messageService: MessageService,
    private readonly auth: AuthService,
    private readonly wallet: WalletService
  ) { }

  ngOnInit(): void {

    this.subskink.sink = this.wallet.checkOrRegister()
      .pipe(
        tap((walletInfo) => {

          this.isWalletInfoLoaded = true;
          this.userPrincipal = walletInfo.principal;
          this.userBalance = walletInfo.balance
    
          if (walletInfo.receivedBonus) {
    
            this.showSuccessNotification('Welcome, you have just received 100 MOC, 🤑enjoy!');
          }
        }),
        switchMap((walletInfo) => this.wallet.getLogBook(walletInfo.principal) )
      )    
      .subscribe((logBook) => {

        this.logBook = logBook;
      });
  }

  ngOnDestroy(): void {
    
    this.subskink.unsubscribe();
  }

  public popUpTransfer(): void {
    
    this.dialog.open(TransferFormContainerComponent, {
      width: '80%',
      showHeader: false,
      closeOnEscape: true,
      data: {
        userBalance: this.userBalance,
        userPrincipal: this.userPrincipal
      }
    } as DynamicDialogConfig).onClose.subscribe((transfer: Transfer | TransferError | undefined) => {

      if (!transfer) { return; }

      if (transfer instanceof TransferError) {

        this.showErrorNotification(transfer.message);
        return;
      }
    
      this.handleSuccessfullTransaction(transfer);
    });
  }

  public logOut(): void {

    this.subskink.sink = this.auth.logOut(this.auth.authClient).subscribe(_ => this.router.navigateByUrl('/login'));
  }

  private handleSuccessfullTransaction(transfer: Transfer): void {

    this.userBalance = (this.userBalance - transfer.amountToTransfer);
    this.logBook = this.addTransferToTransactionLogBook(transfer);

    this.showSuccessNotification('Your transaction was successfully completed!');
  }

  private showSuccessNotification(message: string): void {
   
    this.messageService.clear();
    this.messageService.add({ key: 'dashboard-notifications', severity: 'success', summary: 'Success', detail: message });
  }

  private showErrorNotification(message: string): void {

    this.messageService.clear();
    this.messageService.add({ key: 'dashboard-notifications', severity: 'error', summary: 'Error', detail: message });
  }  

  private addTransferToTransactionLogBook(transfer: Transfer): Transaction[] {
    
    const { userPrincipal:originOwner, targetPrincipal:destinationOwner, amountToTransfer:transferredAmount } = transfer;
    const transactionDate = new Date();

    const transaction = { originOwner, destinationOwner, transferredAmount, transactionDate } as Transaction;

    return [ transaction, ...this.logBook ];
  }
}
