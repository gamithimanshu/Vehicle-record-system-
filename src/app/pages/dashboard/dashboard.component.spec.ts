import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideRouter } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../core/services/auth.service';
import { VehicleService } from '../../core/services/vehicle.service';

describe('DashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { data: { currentUser: null } } }
        },
        {
          provide: AuthService,
          useValue: { getCurrentUserData: jasmine.createSpy('getCurrentUserData').and.resolveTo(null) }
        },
        {
          provide: VehicleService,
          useValue: { getVehicles: jasmine.createSpy('getVehicles').and.resolveTo([]) }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(DashboardComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
