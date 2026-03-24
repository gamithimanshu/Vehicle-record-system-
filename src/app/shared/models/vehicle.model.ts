import { FieldValue, Timestamp } from 'firebase/firestore';

export interface Vehicle {
  id?: string;
  registrationNumber: string;
  licenseNumber: string;
  ownerName: string;
  vehicleType: string;
  usageType: string;
  fuelType: string;
  manufacturer: string;
  model: string;
  year: number;
  color: string;
  createdBy: string;
  createdAt?: Timestamp | FieldValue;
}
