import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TypingAnimationService } from '../services/typing-animation.service';

@Component({
  selector: 'app-developers',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './developers.component.html',
  styleUrls: ['./developers.component.scss',
		'./developers.component.adaptives.scss'
	],
})
export class DevelopersComponent implements AfterViewInit, OnDestroy {
  @ViewChild('description') descriptionEl!: ElementRef<HTMLElement>;
	@ViewChild('description2') description2El!: ElementRef<HTMLElement>;
	@ViewChild('description3') description3El!: ElementRef<HTMLElement>;

  isMobileMenuOpen = false;

  constructor(
    private renderer: Renderer2,
    private typingAnimation: TypingAnimationService
  ) {}

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    const pageContainer = document.querySelector('.page-container') as HTMLElement;
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

  ngAfterViewInit(): void {
    this.typingAnimation.initialize(
      undefined, // Не передаем основной элемент для печати AlyraLabs
      [this.descriptionEl, this.description2El, this.description3El],
      this.renderer
    );
  }

  ngOnDestroy(): void {
    this.typingAnimation.destroy();
    
    // Восстанавливаем скролл
    document.body.style.overflow = '';
    const pageContainer = document.querySelector('.page-container') as HTMLElement;
    if (pageContainer) {
      pageContainer.style.overflow = '';
      pageContainer.style.height = '';
    }
  }
} 