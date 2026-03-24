import { Injectable } from '@angular/core';
import { User, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Auth, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  confirmPassword?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private firestore: Firestore
  ) {}

  getAuthState(): Observable<User | null> {
    return authState(this.auth);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  async register(payload: RegisterPayload) {
    const credentials = await createUserWithEmailAndPassword(
      this.auth,
      payload.email,
      payload.password
    );

    await setDoc(doc(this.firestore, 'users', credentials.user.uid), {
      uid: credentials.user.uid,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      role: payload.role || 'user',
      createdAt: new Date()
    });

    return credentials.user;
  }

  async login(email: string, password: string) {
    const credentials = await signInWithEmailAndPassword(this.auth, email, password);
    return credentials.user;
  }

  async logout() {
    await signOut(this.auth);
  }

  async getCurrentUserData(uid: string) {
    const snapshot = await getDoc(doc(this.firestore, 'users', uid));
    return snapshot.exists() ? snapshot.data() : null;
  }
}
