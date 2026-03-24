import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { User } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AuthService } from '../../core/auth.service';
import { Vehicle } from '../../shared/models/vehicle.model';
import { VehicleService } from '../vehicle/vehicle.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly currentUser = this.route.snapshot.data['currentUser'] as User | null;

  userName = '';
  vehicles: (Vehicle & { id: string })[] = [];
  editingVehicleId: string | null = null;

  editForm = this.fb.group({
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
    private authService: AuthService,
    private vehicleService: VehicleService,
    private fb: FormBuilder
  ) {}

  async ngOnInit() {
    const uid = this.currentUser?.uid;
    if (uid) {
      const userData: any = await this.authService.getCurrentUserData(uid);
      this.userName = userData?.fullName || this.currentUser?.displayName || this.currentUser?.email || 'Admin';
    }
    await this.loadVehicles();
  }

  async loadVehicles() {
    this.vehicles = await this.vehicleService.getVehicles();
  }

  startEdit(vehicle: Vehicle & { id: string }) {
    this.editingVehicleId = vehicle.id;
    this.editForm.setValue({
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

  cancelEdit() {
    this.editingVehicleId = null;
    this.editForm.reset();
  }

  async saveEdit(vehicleId: string) {
    if (this.editForm.invalid) {
      return;
    }
    const formValue = this.editForm.getRawValue();
    const payload = {
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
    };

    await this.vehicleService.updateVehicle(vehicleId, payload);
    this.vehicles = this.vehicles.map(vehicle =>
      vehicle.id === vehicleId ? { ...vehicle, ...payload } : vehicle
    );
    this.cancelEdit();
  }

  async delete(vehicleId: string) {
    await this.vehicleService.deleteVehicle(vehicleId);
    this.vehicles = this.vehicles.filter(v => v.id !== vehicleId);
  }
}
