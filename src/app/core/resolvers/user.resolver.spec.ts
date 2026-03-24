import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { userResolver } from './user.resolver';
import { AuthService } from '../services/auth.service';

describe('userResolver', () => {
  it('should resolve current user state', done => {
    const user = { uid: '123' } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { getAuthState: () => of(user) } }
      ]
    });

    TestBed.runInInjectionContext(() => {
      (userResolver({} as any, {} as any) as any).subscribe((resolved: any) => {
        expect(resolved).toEqual(user);
        done();
      });
    });
  });
});
