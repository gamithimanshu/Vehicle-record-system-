import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { User } from '@angular/fire/auth';

import { Vehicle } from '../../core/models/vehicle.model';
import { AuthService } from '../../core/services/auth.service';
import { VehicleService } from '../../core/services/vehicle.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly currentUser = this.route.snapshot.data['currentUser'] as User | null;

  userName = '';
  vehicles: (Vehicle & { id: string })[] = [];
  filteredVehicles: (Vehicle & { id: string })[] = [];

  searchTerm = '';
  selectedVehicleType = 'all';
  selectedUsageType = 'all';
  selectedFuelType = 'all';
  selectedYear = 'all';

  vehicleTypes: string[] = [];
  usageTypes: string[] = [];
  fuelTypes: string[] = [];
  years: string[] = [];

  constructor(
    private authService: AuthService,
    private vehicleService: VehicleService
  ) {}

  async ngOnInit() {
    const uid = this.currentUser?.uid;
    if (uid) {
      const userData = await this.authService.getCurrentUserData(uid);
      this.userName = userData?.fullName || this.currentUser?.displayName || this.currentUser?.email || 'Admin';
    }
    await this.loadVehicles();
  }

  async loadVehicles() {
    this.vehicles = await this.vehicleService.getVehicles();
    this.vehicleTypes = this.buildOptions(this.vehicles.map(vehicle => vehicle.vehicleType));
    this.usageTypes = this.buildOptions(this.vehicles.map(vehicle => vehicle.usageType));
    this.fuelTypes = this.buildOptions(this.vehicles.map(vehicle => vehicle.fuelType));
    this.years = this.buildOptions(this.vehicles.map(vehicle => String(vehicle.year)));
    this.applyFilters();
  }

  applyFilters() {
    const query = this.searchTerm.trim().toLowerCase();

    this.filteredVehicles = this.vehicles.filter(vehicle => {
      const matchesSearch =
        !query ||
        [
          vehicle.registrationNumber,
          vehicle.licenseNumber,
          vehicle.ownerName,
          vehicle.vehicleType,
          vehicle.usageType,
          vehicle.fuelType,
          vehicle.manufacturer,
          vehicle.model,
          vehicle.color,
          String(vehicle.year)
        ].some(value => value.toLowerCase().includes(query));

      const matchesVehicleType =
        this.selectedVehicleType === 'all' || vehicle.vehicleType === this.selectedVehicleType;
      const matchesUsageType =
        this.selectedUsageType === 'all' || vehicle.usageType === this.selectedUsageType;
      const matchesFuelType =
        this.selectedFuelType === 'all' || vehicle.fuelType === this.selectedFuelType;
      const matchesYear = this.selectedYear === 'all' || String(vehicle.year) === this.selectedYear;

      return matchesSearch && matchesVehicleType && matchesUsageType && matchesFuelType && matchesYear;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedVehicleType = 'all';
    this.selectedUsageType = 'all';
    this.selectedFuelType = 'all';
    this.selectedYear = 'all';
    this.applyFilters();
  }

  async delete(vehicleId: string) {
    await this.vehicleService.deleteVehicle(vehicleId);
    await this.loadVehicles();
  }

  private buildOptions(values: string[]) {
    return [...new Set(values.filter(Boolean))].sort((first, second) => first.localeCompare(second));
  }
}
