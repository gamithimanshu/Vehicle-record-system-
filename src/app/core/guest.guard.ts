import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom, take } from 'rxjs';

import { AuthService } from './auth.service';

export const guestGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const user = await firstValueFrom(authService.getAuthState().pipe(take(1)));

  if (!user) {
    return true;
  }

  const userData: any = await authService.getCurrentUserData(user.uid);
  return userData?.role === 'admin'
    ? router.createUrlTree(['/dashboard'])
    : router.createUrlTree(['/vehicles']);
};
