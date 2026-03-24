export type UserRole = 'admin' | 'user';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt?: unknown;
}
