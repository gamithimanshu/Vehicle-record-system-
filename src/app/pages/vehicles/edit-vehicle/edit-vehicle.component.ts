import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Vehicle } from '../../../core/models/vehicle.model';
import { VehicleService } from '../../../core/services/vehicle.service';

@Component({
  selector: 'app-edit-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.css'
})
export class EditVehicleComponent implements OnInit {
  isLoading = true;
  isSubmitting = false;
  vehicleNotFound = false;
  vehicleId = '';

  vehicleForm = this.fb.group({
    registrationNumber: ['', Validators.required],
    licenseNumber: ['', Validators.required],
    ownerName: ['', Validators.required],
    vehicleType: ['', Validators.required],
    usageType: ['', Validators.required],
    fuelType: ['', Validators.required],
    manufacturer: ['', Validators.required],
    model: ['', Validators.required],
    year: [null as number | null, [Validators.required, Validators.min(1900)]],
    color: ['', Validators.required]
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private vehicleService: VehicleService
  ) {}

  async ngOnInit() {
    const vehicleId = this.route.snapshot.paramMap.get('id');

    if (!vehicleId) {
      await this.router.navigate(['/dashboard']);
      return;
    }

    this.vehicleId = vehicleId;

    try {
      const vehicle = await this.vehicleService.getVehicleById(vehicleId);

      if (!vehicle) {
        this.vehicleNotFound = true;
        return;
      }

      this.patchForm(vehicle);
    } catch (error: any) {
      alert(error?.message || 'Failed to load vehicle details.');
      await this.router.navigate(['/dashboard']);
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    if (this.vehicleForm.invalid || this.isSubmitting || !this.vehicleId) {
      return;
    }

    this.isSubmitting = true;

    try {
      const formValue = this.vehicleForm.getRawValue();
      await this.vehicleService.updateVehicle(this.vehicleId, {
        registrationNumber: (formValue.registrationNumber || '').trim(),
        licenseNumber: (formValue.licenseNumber || '').trim(),
        ownerName: (formValue.ownerName || '').trim(),
        vehicleType: (formValue.vehicleType || '').trim(),
        usageType: (formValue.usageType || '').trim(),
        fuelType: (formValue.fuelType || '').trim(),
        manufacturer: (formValue.manufacturer || '').trim(),
        model: (formValue.model || '').trim(),
        year: Number(formValue.year),
        color: (formValue.color || '').trim()
      });

      alert('Vehicle updated successfully.');
      await this.router.navigate(['/dashboard']);
    } catch (error: any) {
      alert(error?.message || 'Failed to update vehicle.');
    } finally {
      this.isSubmitting = false;
    }
  }

  private patchForm(vehicle: Vehicle & { id: string }) {
    this.vehicleForm.patchValue({
      registrationNumber: vehicle.registrationNumber,
      licenseNumber: vehicle.licenseNumber,
      ownerName: vehicle.ownerName,
      vehicleType: vehicle.vehicleType,
      usageType: vehicle.usageType,
      fuelType: vehicle.fuelType,
      manufacturer: vehicle.manufacturer,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color
    });
  }
}
