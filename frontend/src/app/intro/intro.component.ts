import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TypingAnimationService } from '../services/typing-animation.service';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss',
		'./intro.component.adaptives.scss'
	],
})
export class IntroComponent implements AfterViewInit, OnDestroy {
  @ViewChild('description') descriptionEl!: ElementRef<HTMLElement>;
	@ViewChild('description2') description2El!: ElementRef<HTMLElement>;
	@ViewChild('description3') description3El!: ElementRef<HTMLElement>;

  private intersectionObserver?: IntersectionObserver;
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

    // Инициализация анимации тегов при скролле
    this.initializeScrollAnimations();
  }

  private initializeScrollAnimations(): void {
    const tags = document.querySelectorAll('.tag');
    const buttons = document.querySelectorAll('.button');
    const postTexts = document.querySelectorAll('.post p');
    // Исключаем главный заголовок из общей анимации
    const headings = document.querySelectorAll('h1:not(.hero-title), h2, h3');
    const principleParagraphs = document.querySelectorAll('.principle p');
    const principleHeadings = document.querySelectorAll('.principle h3');
    const developerParagraphs = document.querySelectorAll('.developer p');
    const developerHeadings = document.querySelectorAll('.developer h3');
    
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains('tag')) {
              entry.target.classList.add('tag-visible');
            } else if (entry.target.classList.contains('button')) {
              entry.target.classList.add('button-visible');
            } else if (entry.target.parentElement?.classList.contains('post')) {
              entry.target.classList.add('post-text-visible');
            } else if (entry.target.parentElement?.classList.contains('principle') && entry.target.matches('p')) {
              entry.target.classList.add('paragraph-visible');
            } else if (entry.target.parentElement?.classList.contains('principle') && entry.target.matches('h3')) {
              entry.target.classList.add('heading-visible');
            } else if (entry.target.parentElement?.classList.contains('developer') && entry.target.matches('p')) {
              entry.target.classList.add('paragraph-visible');
            } else if (entry.target.parentElement?.classList.contains('developer') && entry.target.matches('h3')) {
              entry.target.classList.add('heading-visible');
            } else if (entry.target.matches('h1, h2, h3')) {
              entry.target.classList.add('heading-visible');
            }
            // Отключаем наблюдение после появления
            this.intersectionObserver?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2, // Анимация начнется когда 20% элемента видны
        rootMargin: '0px 0px -50px 0px' // Небольшой отступ снизу
      }
    );

    tags.forEach((tag) => {
      this.intersectionObserver?.observe(tag);
    });

    buttons.forEach((button) => {
      this.intersectionObserver?.observe(button);
    });

    postTexts.forEach((text) => {
      this.intersectionObserver?.observe(text);
    });

    headings.forEach((heading) => {
      this.intersectionObserver?.observe(heading);
    });

    principleParagraphs.forEach((paragraph) => {
      this.intersectionObserver?.observe(paragraph);
    });

    principleHeadings.forEach((heading) => {
      this.intersectionObserver?.observe(heading);
    });

    developerParagraphs.forEach((paragraph) => {
      this.intersectionObserver?.observe(paragraph);
    });

    developerHeadings.forEach((heading) => {
      this.intersectionObserver?.observe(heading);
    });
  }

  ngOnDestroy(): void {
    this.typingAnimation.destroy();
    
    // Отключаем наблюдателя при уничтожении компонента
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    
    // Восстанавливаем скролл
    document.body.style.overflow = '';
    const pageContainer = document.querySelector('.page-container') as HTMLElement;
    if (pageContainer) {
      pageContainer.style.overflow = '';
      pageContainer.style.height = '';
    }
  }
} 