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

  isMobileMenuOpen = false;
  
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;
  private performanceObserver?: IntersectionObserver;

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

    // Инициализация drag-to-scroll для чейнов
    this.initializeChainsScroll();
    
    // Инициализация анимации счетчика для статистики
    this.initializePerformanceCounter();
  }

  private initializeChainsScroll(): void {
    const chainsTrack = document.querySelector('.chains-track') as HTMLElement;
    if (!chainsTrack) return;
    
    let currentPosition = 0;
    let animationId: number | null = null;

    const animate = () => {
      currentPosition -= 1.5; // Скорость анимации (пикселей за кадр)
      
      // Бесконечный цикл: когда доходим до конца, возвращаемся в начало
      const totalDistance = (400 + 40) * 27;
      if (currentPosition <= -totalDistance) {
        currentPosition = 0;
      }
      
      chainsTrack.style.transform = `translateX(${currentPosition}px)`;
      animationId = requestAnimationFrame(animate);
    };
    
    // Запускаем анимацию
    animate();

    chainsTrack.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      chainsTrack.classList.add('dragging');
      this.startX = e.pageX;
      this.scrollLeft = currentPosition;
      
      // Останавливаем анимацию
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      e.preventDefault();
      const x = e.pageX;
      const walk = (x - this.startX) * 0.8;
      currentPosition = this.scrollLeft + walk;
      chainsTrack.style.transform = `translateX(${currentPosition}px)`;
    });

    const endDrag = () => {
      if (this.isDragging) {
        this.isDragging = false;
        chainsTrack.classList.remove('dragging');
        
        // Возобновляем анимацию с текущей позиции
        animate();
      }
    };

    document.addEventListener('mouseup', endDrag);
    document.addEventListener('mouseleave', endDrag);
  }

  private initializePerformanceCounter(): void {
    const performanceSection = document.querySelector('.perfomance');
    if (!performanceSection) return;

    this.performanceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Запускаем анимацию счетчика
            this.animateCounter('.perfomance-container .perfomance-item:nth-child(1) h1', 25, 0);
            this.animateCounter('.perfomance-container .perfomance-item:nth-child(2) h1', 300, 0, '<', 'ms');
            this.animateCounter('.perfomance-container .perfomance-item:nth-child(3) h1', 30, 0);
            this.animateCounter('.perfomance-container .perfomance-item:nth-child(4) h1', 99.9, 0, '', '%', true);
            
            // Отключаем наблюдение после запуска
            this.performanceObserver?.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3
      }
    );

    this.performanceObserver.observe(performanceSection);
  }

  private animateCounter(
    selector: string, 
    target: number, 
    start: number = 0, 
    prefix: string = '', 
    suffix: string = '',
    isDecimal: boolean = false
  ): void {
    const element = document.querySelector(selector) as HTMLElement;
    if (!element) return;

    const duration = 2000; // 2 секунды
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function для плавности (easeOutQuart)
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      
      const current = start + (target - start) * easeProgress;
      
      if (isDecimal) {
        element.textContent = prefix + current.toFixed(1) + suffix;
      } else {
        element.textContent = prefix + Math.floor(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  ngOnDestroy(): void {
    this.typingAnimation.destroy();
    
    // Отключаем наблюдателя performance
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
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