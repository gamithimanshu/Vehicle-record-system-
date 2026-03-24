import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { serverTimestamp } from 'firebase/firestore';

import { AuthService } from '../../../core/auth.service';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'app-add-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.css'
})
export class AddVehicleComponent {
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private vehicleService: VehicleService
  ) {}

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

  async onSubmit() {
    if (this.isSubmitting || this.vehicleForm.invalid) {
      return;
    }

    const currentUser = this.authService.getCurrentUser();
    if (!currentUser?.uid) {
      alert('Please login again.');
      return;
    }

    this.isSubmitting = true;
    try {
      const formValue = this.vehicleForm.getRawValue();
      await this.vehicleService.addVehicle({
        registrationNumber: (formValue.registrationNumber || '').trim(),
        licenseNumber: (formValue.licenseNumber || '').trim(),
        ownerName: (formValue.ownerName || '').trim(),
        vehicleType: (formValue.vehicleType || '').trim(),
        usageType: (formValue.usageType || '').trim(),
        fuelType: (formValue.fuelType || '').trim(),
        manufacturer: (formValue.manufacturer || '').trim(),
        model: (formValue.model || '').trim(),
        year: Number(formValue.year),
        color: (formValue.color || '').trim(),
        createdBy: currentUser.uid,
        createdAt: serverTimestamp()
      });
      alert('Vehicle Added');
      this.vehicleForm.reset();
    } catch (error: any) {
      alert(error?.message || 'Failed to add vehicle.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
