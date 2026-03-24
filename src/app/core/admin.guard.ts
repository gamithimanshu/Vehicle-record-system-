import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { firstValueFrom, take } from 'rxjs';

import { AuthService } from './auth.service';

export const adminGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const user = await firstValueFrom(authService.getAuthState().pipe(take(1)));

  if (!user) {
    return router.createUrlTree(['/login']);
  }

  const userData: any = await authService.getCurrentUserData(user.uid);
  return userData?.role === 'admin' ? true : router.createUrlTree(['/vehicles']);
};
