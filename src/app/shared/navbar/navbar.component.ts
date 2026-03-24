import { Component, DestroyRef, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '@angular/fire/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  private readonly destroyRef = inject(DestroyRef);

  isScrolled = false;
  user$: Observable<User | null>;
  userRole: 'admin' | 'user' | null = null;
  userName: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user$ = this.authService.getAuthState();

    this.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async user => {
        if (!user) {
          this.userRole = null;
          this.userName = null;
          return;
        }

        const userData: any = await this.authService.getCurrentUserData(user.uid);
        this.userRole = userData?.role === 'admin' ? 'admin' : 'user';
        this.userName = userData?.fullName || user.displayName || user.email || 'User';
      });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 12;
  }

  async onLogout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }
}
