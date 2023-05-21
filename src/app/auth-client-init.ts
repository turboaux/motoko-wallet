import { tap, share  } from 'rxjs/operators';
import { AuthService } from './auth/shared/services/auth.service';

export function authClientInit(authService: AuthService) {

  return () => authService.initAuthClient()
    .pipe(
      share(),
      tap((authClient) => authService.authClient = authClient)
    );
}
