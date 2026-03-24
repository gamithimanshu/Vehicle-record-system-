import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            login: jasmine.createSpy('login').and.resolveTo(),
            getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ uid: '1' }),
            getCurrentUserData: jasmine.createSpy('getCurrentUserData').and.resolveTo({ role: 'user' })
          }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
