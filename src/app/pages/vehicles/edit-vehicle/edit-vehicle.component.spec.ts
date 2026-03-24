import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { EditVehicleComponent } from './edit-vehicle.component';
import { VehicleService } from '../../../core/services/vehicle.service';

describe('EditVehicleComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditVehicleComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => 'vehicle-1'
              }
            }
          }
        },
        {
          provide: VehicleService,
          useValue: {
            getVehicleById: jasmine.createSpy('getVehicleById').and.resolveTo(null),
            updateVehicle: jasmine.createSpy('updateVehicle').and.resolveTo()
          }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(EditVehicleComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
