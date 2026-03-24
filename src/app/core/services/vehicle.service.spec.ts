import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';

import { VehicleService } from './vehicle.service';

describe('VehicleService', () => {
  let service: VehicleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Firestore, useValue: {} }]
    });
    service = TestBed.inject(VehicleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
