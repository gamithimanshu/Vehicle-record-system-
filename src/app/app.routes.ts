import { Routes } from '@angular/router';

import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { userResolver } from './core/resolvers/user.resolver';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about-us',
    loadComponent: () => import('./pages/about/about-us.component').then(m => m.AboutUsComponent)
  },
  {
    path: 'contact-us',
    loadComponent: () => import('./pages/contact/contact-us.component').then(m => m.ContactUsComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard, adminGuard],
    resolve: { currentUser: userResolver }
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'add-vehicle',
    loadComponent: () =>
      import('./pages/vehicles/add-vehicle/add-vehicle.component').then(m => m.AddVehicleComponent),
    canActivate: [authGuard]
  },
  {
    path: 'edit-vehicle/:id',
    loadComponent: () =>
      import('./pages/vehicles/edit-vehicle/edit-vehicle.component').then(m => m.EditVehicleComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'vehicles',
    loadComponent: () =>
      import('./pages/vehicles/vehicle-list/vehicle-list.component').then(m => m.VehicleListComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'home' }
];
