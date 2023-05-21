import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

export const authenticateGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  
  const router: Router = inject(Router);
  const auth: AuthService = inject(AuthService);

  return auth.isAuthenticated(auth.authClient)
    .pipe(
      tap((isAuthenticated) => {

        if ( !isAuthenticated ) {
          
          router.navigateByUrl('/login');
        }
      })
    );
};