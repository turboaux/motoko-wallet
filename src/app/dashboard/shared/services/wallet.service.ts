import { Injectable } from '@angular/core';
import { Observable, from, pipe } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Principal } from '@dfinity/principal';
import { Identity, ActorSubclass } from '@dfinity/agent';
import { Account, _SERVICE, Result } from 'src/declarations/backend/backend.did';
import { canisterId, createActor, CreateActorOptions } from 'src/declarations/backend';

import { AuthService } from '@app/auth/shared/services/auth.service';
import { Transfer } from '../models/transfer';
import { Wallet } from '../models/wallet';
import { Transaction } from '../models/transaction';
import { TransferError, TransferErrorName} from '../errors/transfer-error';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private readonly auth: AuthService) { }

  public checkOrRegister(): Observable<Wallet> {
    
    return this.auth.getIdentity()
      .pipe(
        switchMap((userIdentity) => {
          
          const account = this.initializeAccount(userIdentity.getPrincipal().toString());

          return from(this.motokoWalletActor(userIdentity).checkOrRegister(account))
            .pipe(
              map((wallet) => JSON.parse(wallet) as Wallet),
              map((wallet) => {
      
                const principal: string = wallet.principal;
                const balance: number = +wallet.balance;
                const receivedBonus: boolean = !!wallet.receivedBonus;
      
                return { principal, balance, receivedBonus } as Wallet;
              })
            );    
          })
      );   
  }

  public transfer(userPrincipal: string, targetPrincipal: string, amountToTransfer: number): Observable<Transfer> {

    const accountFrom: Account = this.initializeAccount(userPrincipal);
    const accountTo: Account = this.initializeAccount(targetPrincipal);

    return this.auth.getIdentity()
        .pipe(
          switchMap((userIdentity) => {

            return from(this.motokoWalletActor(userIdentity).transfer(accountFrom, accountTo, BigInt(amountToTransfer)))
              .pipe(
                map((result: Result) => {

                  const ok = (<{ ok: null }>result).ok;
                  const err = (<{ err: string }>result).err;
        
                  if (err) { this.throwErrorException(err); }
        
                  return { userPrincipal, targetPrincipal, amountToTransfer } as Transfer;
                })
              ) 
          })
        );
  }

  public getLogBook(userPrincipal: string): Observable<Transaction[]> {

    const accountFrom: Account = this.initializeAccount(userPrincipal);

    return this.auth.getIdentity()
    .pipe(
      switchMap((userIdentity) => {

        return from(this.motokoWalletActor(userIdentity).getLogBook(accountFrom))
          .pipe(
            map((logBook) => JSON.parse(logBook) as Transaction[]), 
            map((logBook) => {

              return logBook.map((log: any) => {

                const originOwner: string = log.originOwner;
                const destinationOwner: string = log.destinationOwner;
                const transferredAmount: number = +log.transferredAmount;
                const transactionDate: Date = new Date(log.transactionDate / 1000000);
  
                return { originOwner, destinationOwner, transferredAmount, transactionDate } as Transaction;
              });
            }),
          );
      })
    );
  }

  private initializeAccount(principal: string): Account {

    return {
      owner: Principal.fromText(principal), 
      subaccount: []
    } as Account;
  }

  private motokoWalletActor(identity: Identity): ActorSubclass<_SERVICE> {

    return createActor(canisterId, {
      agentOptions: { identity: identity }
    } as CreateActorOptions);
  }

  private throwErrorException(err: string): void {
    
    const error = JSON.parse(err);
    const errorKey = Object.keys(error)[0] as TransferErrorName;
 
    throw new TransferError({
      name: errorKey,
      message: error[errorKey]
    });
  }
}
