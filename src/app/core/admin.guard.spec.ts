import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { AuthService } from './auth.service';
import { adminGuard } from './admin.guard';

describe('adminGuard', () => {
  const routerMock = {
    createUrlTree: jasmine.createSpy('createUrlTree').and.returnValue('/login' as any)
  };

  it('should redirect to login when no user', async () => {
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

    const result = await TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual('/login' as any);
  });

  it('should allow admin user', async () => {
    const authServiceMock = {
      getAuthState: () => of({ uid: '1' }),
      getCurrentUserData: jasmine.createSpy('getCurrentUserData').and.resolveTo({ role: 'admin' })
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock }
      ]
    });

    const result = await TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any));
    expect(result).toBeTrue();
  });
});
