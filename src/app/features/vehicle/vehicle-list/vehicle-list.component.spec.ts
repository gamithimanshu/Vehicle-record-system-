import { TestBed } from '@angular/core/testing';

import { VehicleListComponent } from './vehicle-list.component';
import { VehicleService } from '../vehicle.service';

describe('VehicleListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleListComponent],
      providers: [
        {
          provide: VehicleService,
          useValue: { getVehicles: jasmine.createSpy('getVehicles').and.resolveTo([]), deleteVehicle: jasmine.createSpy('deleteVehicle').and.resolveTo() }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(VehicleListComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
