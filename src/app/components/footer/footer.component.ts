import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { UserRole } from '../../core/models/user-profile.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  private readonly destroyRef = inject(DestroyRef);

  readonly currentYear = new Date().getFullYear();
  user$: Observable<User | null>;
  userRole: UserRole | null = null;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.getAuthState();

    this.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async user => {
        if (!user) {
          this.userRole = null;
          return;
        }

        const userData = await this.authService.getCurrentUserData(user.uid);
        this.userRole = userData?.role ?? 'user';
      });
  }
}
