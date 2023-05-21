import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Principal } from '@dfinity/principal';
import { ActorSubclass } from '@dfinity/agent';
import { Account, _SERVICE } from 'src/declarations/backend/backend.did';
import { canisterId, createActor, CreateActorOptions } from 'src/declarations/backend';

import { AuthService } from '@app/auth/shared/services/auth.service';
import { Wallet } from '../models/wallet';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  private motokoWallet!: ActorSubclass<_SERVICE>;

  constructor(private readonly auth: AuthService) { 

    this.motokoWallet = createActor(canisterId, {
      agentOptions: { identity: this.auth.getIdentity() }
    } as CreateActorOptions);
  }

  public checkOrRegister(userPrincipal: string): Observable<Wallet> {

    const account = this.initializeAccount(userPrincipal);

    return from(this.motokoWallet.checkOrRegister(account))
      .pipe(
        map((wallet) => JSON.parse(wallet)),
        map((wallet) => {

          const principal: string = wallet.principal;
          const balance: number = +wallet.balance;
          const receivedBonus: boolean = !!wallet.receivedBonus;

          return { principal, balance, receivedBonus } as Wallet;
        })
      );    
  }

  public test(userPrincipal: string) {
    
    const account = this.initializeAccount(userPrincipal);

    return from(this.motokoWallet.test(account));
  }

  public getBalance(userPrincipal: string): Observable<number> {

    const account = this.initializeAccount(userPrincipal);

    return from(this.motokoWallet.balanceOf(account))
      .pipe(
        // Convert BigInt into a number
        map((balance) => Number(balance))
      );
  }

  private initializeAccount(principal: string): Account {

    return {
      owner: Principal.fromText(principal), 
      subaccount: []
    } as Account;
  }
}
