import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

export const redirectIfAuthenticatedGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> => {
  
  const router: Router = inject(Router);
  const auth: AuthService = inject(AuthService);

  return auth.isAuthenticated(auth.authClient)
    .pipe(
        tap((isAuthenticated) => {

            if (isAuthenticated) {
            
                router.navigateByUrl('/');
            }
        }),
        map((isAutenticated) => {

            // We only activate this route as long as we're not authenticated.
            return !isAutenticated;
        }),
    );
};