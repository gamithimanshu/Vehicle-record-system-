import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from './auth.service';
import { guestGuard } from './guest.guard';

describe('guestGuard', () => {
  const routerMock = {
    createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue('/vehicles' as any)
  };

  it('should allow guest users', async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        {
          provide: AuthService,
          useValue: {
            getAuthState: () => of(null),
            getCurrentUserData: jasmine.createSpy('getCurrentUserData')
          }
        }
      ]
    });

    const result = await TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
    expect(result).toBeTrue();
  });

  it('should redirect logged-in non-admin user to vehicles', async () => {
    const authServiceMock = {
      getAuthState: () => of({ uid: '1' }),
      getCurrentUserData: jasmine.createSpy('getCurrentUserData').and.resolveTo({ role: 'user' })
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    const result = await TestBed.runInInjectionContext(() => guestGuard({} as any, {} as any));
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/vehicles']);
    expect(result).toEqual('/vehicles' as any);
  });
});
