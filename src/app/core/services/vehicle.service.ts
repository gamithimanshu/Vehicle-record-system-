import { Injectable } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc
} from '@angular/fire/firestore';

import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  constructor(private firestore: Firestore) {}

  async addVehicle(data: Omit<Vehicle, 'id'>): Promise<Vehicle & { id: string }> {
    const docRef = await addDoc(collection(this.firestore, 'vehicles'), data);
    return { id: docRef.id, ...data };
  }

  async getVehicles(): Promise<(Vehicle & { id: string })[]> {
    const vehiclesQuery = query(
      collection(this.firestore, 'vehicles'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(vehiclesQuery);

    return snapshot.docs.map(document => ({
      id: document.id,
      ...(document.data() as Vehicle)
    }));
  }

  async getVehicleById(id: string): Promise<(Vehicle & { id: string }) | null> {
    const snapshot = await getDoc(doc(this.firestore, 'vehicles', id));

    if (!snapshot.exists()) {
      return null;
    }

    return {
      id: snapshot.id,
      ...(snapshot.data() as Vehicle)
    };
  }

  async deleteVehicle(id: string): Promise<{ success: boolean }> {
    await deleteDoc(doc(this.firestore, 'vehicles', id));
    return { success: true };
  }

  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle & { id: string }> {
    await updateDoc(doc(this.firestore, 'vehicles', id), data);
    return { id, ...(data as Vehicle) };
  }
}
