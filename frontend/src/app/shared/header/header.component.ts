import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', './header.component.adaptives.scss'],
})
export class HeaderComponent {
  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    const pageContainer = document.querySelector('.page-container') as HTMLElement | null;

    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      if (pageContainer) {
        pageContainer.style.overflow = 'hidden';
        pageContainer.style.height = 'calc(100dvh - 40px)';
      }
    } else {
      document.body.style.overflow = '';
      if (pageContainer) {
        pageContainer.style.overflow = '';
        pageContainer.style.height = '';
      }
    }
  }

  closeMobileMenu(): void {
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }
}
