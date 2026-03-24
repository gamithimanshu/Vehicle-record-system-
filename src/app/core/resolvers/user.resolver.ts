import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { User } from '@angular/fire/auth';
import { take } from 'rxjs';

import { AuthService } from '../services/auth.service';

export const userResolver: ResolveFn<User | null> = () => {
  const authService = inject(AuthService);
  return authService.getAuthState().pipe(take(1));
};
