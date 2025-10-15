import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TypingAnimationService } from '../services/typing-animation.service';
import { TitleAnimationService } from '../services/title-animation.service';

@Component({
  selector: 'app-community',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.scss',
		'./community.component.adaptives.scss'
	],
})
export class CommunityComponent implements AfterViewInit, OnDestroy {
  @ViewChild('description') descriptionEl!: ElementRef<HTMLElement>;
	@ViewChild('description2') description2El!: ElementRef<HTMLElement>;
	@ViewChild('description3') description3El!: ElementRef<HTMLElement>;

  isMobileMenuOpen = false;
  private menuItems: { element: HTMLElement; originalText: string }[] = [];
  private activeAnimations: Set<HTMLElement> = new Set();

  constructor(
    private renderer: Renderer2,
    private typingAnimation: TypingAnimationService,
    private titleAnimationService: TitleAnimationService
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
    
    // Инициализация анимации меню
    this.initializeMenuAnimation();
  }

  private initializeMenuAnimation(): void {
    // Анимация для пунктов меню
    const menuLinks = document.querySelectorAll('.menu a');
    
    menuLinks.forEach((link) => {
      const element = link as HTMLElement;
      const originalText = element.textContent || '';
      
      // Сохраняем оригинальный текст
      this.menuItems.push({ element, originalText });
      
      // Добавляем обработчик наведения
      element.addEventListener('mouseenter', () => {
        // Останавливаем только анимацию для текущего элемента
        this.titleAnimationService.clearAnimationForElement(element);
        
        // Устанавливаем оригинальный текст для текущего элемента
        element.textContent = originalText;
        
        // Запускаем новую анимацию
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      // Добавляем обработчик ухода мыши
      element.addEventListener('mouseleave', () => {
        // Не останавливаем анимацию сразу, даем ей доиграть до конца
        // Анимация сама вернет оригинальный текст в конце
      });
    });

    // Анимация для тегов
    const tagElements = document.querySelectorAll('.tag');
    
    tagElements.forEach((tag) => {
      const element = tag as HTMLElement;
      const originalText = element.textContent || '';
      
      // Сохраняем оригинальный текст
      this.menuItems.push({ element, originalText });
      
      // Добавляем обработчик наведения
      element.addEventListener('mouseenter', () => {
        // Останавливаем только анимацию для текущего элемента
        this.titleAnimationService.clearAnimationForElement(element);
        
        // Устанавливаем оригинальный текст для текущего элемента
        element.textContent = originalText;
        
        // Запускаем новую анимацию
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      // Добавляем обработчик ухода мыши
      element.addEventListener('mouseleave', () => {
        // Не останавливаем анимацию сразу, даем ей доиграть до конца
        // Анимация сама вернет оригинальный текст в конце
      });
    });

    // Анимация для ссылок в блоке .bottom-links
    const bottomLinkElements = document.querySelectorAll('.bottom-link');
    
    bottomLinkElements.forEach((bottomLink) => {
      const element = bottomLink as HTMLElement;
      const originalText = element.textContent || '';
      
      // Сохраняем оригинальный текст
      this.menuItems.push({ element, originalText });
      
      // Добавляем обработчик наведения
      element.addEventListener('mouseenter', () => {
        // Останавливаем только анимацию для текущего элемента
        this.titleAnimationService.clearAnimationForElement(element);
        
        // Устанавливаем оригинальный текст для текущего элемента
        element.textContent = originalText;
        
        // Запускаем новую анимацию
        this.activeAnimations.add(element);
        this.titleAnimationService.startTitleAnimation(
          element,
          originalText,
          {
            animationFrames: 30,
            animationSpeed: 25,
            glitchChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
            cyberChars: '01',
            possibleChars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          }
        );
      });
      
      // Добавляем обработчик ухода мыши
      element.addEventListener('mouseleave', () => {
        // Не останавливаем анимацию сразу, даем ей доиграть до конца
        // Анимация сама вернет оригинальный текст в конце
      });
    });
  }

  private stopAllAnimations(): void {
    // Останавливаем все активные анимации
    this.titleAnimationService.clearAnimation();
    
    // Возвращаем оригинальные тексты для всех элементов
    this.menuItems.forEach(({ element, originalText }) => {
      element.textContent = originalText;
    });
    
    // Очищаем список активных анимаций
    this.activeAnimations.clear();
  }

  ngOnDestroy(): void {
    this.typingAnimation.destroy();
    this.stopAllAnimations();
    
    // Восстанавливаем скролл
    document.body.style.overflow = '';
    const pageContainer = document.querySelector('.page-container') as HTMLElement;
    if (pageContainer) {
      pageContainer.style.overflow = '';
      pageContainer.style.height = '';
    }
  }
} 