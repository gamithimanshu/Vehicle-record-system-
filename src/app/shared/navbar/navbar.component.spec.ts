import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../core/auth.service';

describe('NavbarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            getAuthState: () => of(null),
            getCurrentUserData: jasmine.createSpy('getCurrentUserData').and.resolveTo(null),
            logout: jasmine.createSpy('logout').and.resolveTo()
          }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
