import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AuthService } from '../../core/auth.service';

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
  userRole: 'admin' | 'user' | null = null;

  constructor(private authService: AuthService) {
    this.user$ = this.authService.getAuthState();

    this.user$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(async user => {
        if (!user) {
          this.userRole = null;
          return;
        }

        const userData: any = await this.authService.getCurrentUserData(user.uid);
        this.userRole = userData?.role === 'admin' ? 'admin' : 'user';
      });
  }
}
