import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

import { TransferFormContainerComponent } from '../../components/transfer-form-container/transfer-form-container.component';
import { AuthService } from '@app/auth/shared/services/auth.service';
import { WalletService } from '../../shared/services/wallet.service';
import { Transfer } from '../../shared/models/transfer';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {

  public isWalletInfoLoaded: boolean = false;
  public userBalance: number = 0;
  public userPrincipal: string = '';

  private subskink = new SubSink();

  constructor(
    private readonly router: Router,
    private readonly dialog: DialogService,
    private readonly messageService: MessageService,
    private readonly auth: AuthService,
    private readonly wallet: WalletService
  ) { }

  ngOnInit(): void {

    this.userPrincipal = this.auth.getIdentity().getPrincipal().toString();
    this.subskink.sink = this.wallet.checkOrRegister(this.userPrincipal).subscribe((walletInfo) => {
    
      this.isWalletInfoLoaded = true;
      this.userBalance = walletInfo.balance

      if (walletInfo.receivedBonus) {

        this.showSuccessNotification('Welcome, you have just received 100 MOC, 🤑enjoy!');
      }
    });
    
    this.wallet.test(this.userPrincipal).subscribe((res) => console.log(res));
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
    } as DynamicDialogConfig).onClose.subscribe((transfer: Transfer | undefined) => {

      if (!transfer) { return; }
    
      this.handleSuccessfullTransaction(transfer);
    });
  }

  public logOut(): void {

    this.subskink.sink = this.auth.logOut(this.auth.authClient).subscribe(_ => this.router.navigateByUrl('/login'));
  }

  private handleSuccessfullTransaction(transfer: Transfer): void {

    this.userBalance = (this.userBalance - transfer.amountToTransfer);

    this.showSuccessNotification('Your transaction was successfully completed!');

    console.log(transfer);
  }

  private showSuccessNotification(message: string): void {
   
    this.messageService.clear();
    this.messageService.add({ key: 'dashboard-notifications', severity: 'success', summary: 'Success', detail: message });
  }
}
