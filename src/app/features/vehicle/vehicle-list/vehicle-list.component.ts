import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Vehicle } from '../../../shared/models/vehicle.model';
import { VehicleService } from '../vehicle.service';

@Component({
  selector: 'app-vehicle-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-list.component.html',
  styleUrl: './vehicle-list.component.css'
})
export class VehicleListComponent implements OnInit {
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

  constructor(private vehicleService: VehicleService) {}

  async ngOnInit() {
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

  private buildOptions(values: string[]) {
    return [...new Set(values.filter(Boolean))].sort((first, second) => first.localeCompare(second));
  }
}
