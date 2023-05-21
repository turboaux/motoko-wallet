import { Injectable } from '@angular/core';
import { Observable, of, from, Subject } from 'rxjs';
import { tap, map, share  } from 'rxjs/operators';
import { Actor, Identity, AnonymousIdentity } from "@dfinity/agent";
import { AuthClient } from "@dfinity/auth-client";

import { createOptions, loginOptions } from '@app/auth-client-config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedInSubject: Subject<true | string> = new Subject();
  public loggedIn$: Observable<true | string> = this.loggedInSubject.asObservable();

  public authClient!: AuthClient;
  
  constructor() { }

  public initAuthClient(): Observable<AuthClient> {

    return from(AuthClient.create(createOptions))
            .pipe(share());
  }

  public logIn(authClient: AuthClient): Observable<void> {

    return from(authClient.login({ ...loginOptions,
      onSuccess: () => {
        this.loggedInSubject.next(true);
      },
      onError: (error) => {
        this.loggedInSubject.next(`Login failed ${error}`);
      }
    }));
  }

  public getIdentity(): Identity {
    
    return this.authClient.getIdentity();
  }

  public logOut(authClient: AuthClient): Observable<void> {

    return from(authClient.logout());
  } 

  public isAuthenticated(authClient: AuthClient): Observable<boolean> {
    
    return from(authClient.isAuthenticated());
  }
}
