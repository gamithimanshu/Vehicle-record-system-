import { TestBed } from '@angular/core/testing';

import { AddVehicleComponent } from './add-vehicle.component';
import { VehicleService } from '../vehicle.service';

describe('AddVehicleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddVehicleComponent],
      providers: [
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
