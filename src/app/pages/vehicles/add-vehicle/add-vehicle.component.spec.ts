import { TestBed } from '@angular/core/testing';

import { AddVehicleComponent } from './add-vehicle.component';
import { AuthService } from '../../../core/services/auth.service';
import { VehicleService } from '../../../core/services/vehicle.service';

describe('AddVehicleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVehicleComponent],
      providers: [
        {
          provide: AuthService,
          useValue: { getCurrentUser: jasmine.createSpy('getCurrentUser').and.returnValue({ uid: '1' }) }
        },
        {
          provide: VehicleService,
          useValue: { addVehicle: jasmine.createSpy('addVehicle').and.resolveTo() }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(AddVehicleComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
