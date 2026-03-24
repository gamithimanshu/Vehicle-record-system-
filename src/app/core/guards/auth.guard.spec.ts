import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const routerMock = {
    createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue('/login' as any)
  };

  it('should allow access when user exists', async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: { getAuthState: () => of({ uid: '1' }) } }
      ]
    });

    const result = await TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBeTrue();
  });

  it('should redirect to login when user is null', async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: { getAuthState: () => of(null) } }
      ]
    });

    const result = await TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual('/login' as any);
  });
});
