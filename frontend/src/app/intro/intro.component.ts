import { Component, OnInit, OnDestroy, inject, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MouseGradientService } from '../services/mouse-gradient.service';
import { StarAnimationService, Star } from '../services/star-animation.service';
import { NebulaAnimationService, Nebula } from '../services/nebula-animation.service';
import { Observable } from 'rxjs';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-intro',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './intro.component.html',
  styleUrls: ['./intro.component.scss',
		'./intro.component.adaptives.scss'
	],
  animations: [
    trigger('buttonExpand', [
      state('collapsed', style({
        paddingRight: '15px'
      })),
      state('expanded', style({
        paddingRight: 'var(--button-expand-padding)'
      })),
      transition('collapsed <=> expanded', [
        animate('0.4s cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ]),
    trigger('textFade', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(-50%) translateX(-15px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(-50%) translateX(0)'
      })),
      transition('hidden <=> visible', [
        animate('0.4s cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ]),
    trigger('navSlideUp', [
      state('hidden', style({
        transform: 'translateX(-50%) translateY(80px)',
        opacity: 0,
        filter: 'blur(10px)'
      })),
      state('visible', style({
        transform: 'translateX(-50%) translateY(0)',
        opacity: 1,
        filter: 'blur(0px)'
      })),
      transition('hidden => visible', [
        animate('1.2s cubic-bezier(0.23, 1, 0.32, 1)')
      ])
    ]),
    trigger('headerSlideDown', [
      state('hidden', style({
        transform: 'translateY(-80px)',
        opacity: 0,
        filter: 'blur(10px)'
      })),
      state('visible', style({
        transform: 'translateY(0)',
        opacity: 1,
        filter: 'blur(0px)'
      })),
      transition('hidden => visible', [
        animate('1.2s cubic-bezier(0.23, 1, 0.32, 1)')
      ])
    ]),
    trigger('premiumTitleAppear', [
      state('hidden', style({
        opacity: 0
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('hidden => visible', [
        animate('0.1s ease-out')
      ])
    ]),
    trigger('premiumSubtitleAppear', [
      state('hidden', style({
        opacity: 0
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('hidden => visible', [
        animate('0.1s ease-out')
      ])
    ]),

    trigger('mobileMenuSlide', [
      state('closed', style({
        transform: 'translateX(100%)',
        opacity: 0,
        pointerEvents: 'none'
      })),
      state('open', style({
        transform: 'translateX(0)',
        opacity: 1,
        pointerEvents: 'all'
      })),
      transition('closed => open', [
        animate('0.3s cubic-bezier(0.23, 1, 0.32, 1)')
      ]),
      transition('open => closed', [
        animate('0.3s cubic-bezier(0.23, 1, 0.32, 1)')
      ])
    ]),

  ]
})
export class IntroComponent implements OnInit, OnDestroy {

  
  private starAnimationService = inject(StarAnimationService);
  private nebulaAnimationService = inject(NebulaAnimationService);
  stars$: Observable<Star[]>;
  nebulas$: Observable<Nebula[]>;
  
  isButtonHovered = false;
  navAnimationState = 'hidden';
  headerAnimationState = 'hidden';
  titleAnimationState = 'hidden';
  subtitleAnimationState = 'hidden';
  infoTextAnimated = false;
  
  @ViewChild('infoBlock', { static: false }) infoBlock!: ElementRef;
  
  private animationFrameId: number | null = null;

  isNavExpanded = false;
  isEcosystemExpanded = false;
  
  isMobileMenuOpen = false;
  
  // Для скролл эффектов
  private lastScrollY = 0;
  private scrollVelocity = 0;
  private scrollDirection = 0; // 1 = вниз, -1 = вверх
  private scrollAnimationId: number | null = null;
  private isScrolling = false;
  private scrollTimeout: any = null;
  

  constructor(
    private mouseGradientService: MouseGradientService
  ) {
    this.stars$ = this.starAnimationService.stars;
    this.nebulas$ = this.nebulaAnimationService.nebulas;
  }

  ngOnInit() {
    setTimeout(() => {
      this.headerAnimationState = 'visible';
    }, 400);
    
    setTimeout(() => {
      this.titleAnimationState = 'visible';
    }, 1200);
    
    setTimeout(() => {
      this.subtitleAnimationState = 'visible';
    }, 2800);
    
    setTimeout(() => {
      this.navAnimationState = 'visible';
    }, 800);
    
    this.starAnimationService.initializeStars();
    
    this.nebulaAnimationService.initializeNebulas();
    
    (window as any).setStarAnimation = (mode: 'high' | 'medium' | 'low' | 'disabled') => {
      this.starAnimationService.setPerformanceMode(mode);
    };
    
    (window as any).getStarAnimation = () => {
      return this.starAnimationService.getPerformanceMode();
    };
    
    (window as any).regenerateNebulas = () => {
      this.nebulaAnimationService.regenerateNebulas();
    };
    
          this.setupScrollAnimations();
      this.setupScrollEffects();
    }
  
  private setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const target = entry.target as HTMLElement;
        
        if (entry.isIntersecting && !target.classList.contains('animate-in')) {
          target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    const principlesObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const target = entry.target as HTMLElement;
        
        if (entry.isIntersecting && !target.classList.contains('animate-in')) {
          target.classList.add('animate-in');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });

          const infoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.infoTextAnimated) {
            setTimeout(() => this.startInfoTextAnimation(), 300);
          }
        });
      }, {
        threshold: 0.3
      });
    

    setTimeout(() => {
      const regularBlocks = ['.how-block', '.devbridge-block'];
      const principlesBlock = document.querySelector('.principles-block');
      const infoBlock = document.querySelector('.info-block');
      
      regularBlocks.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          observer.observe(element);
        }
      });
      
      if (principlesBlock) {
        principlesObserver.observe(principlesBlock);
      }
      
      if (infoBlock) {
        infoObserver.observe(infoBlock);
      }
    }, 100);
  }
  
  private startInfoTextAnimation() {
    this.infoTextAnimated = true;
    
    // Сначала показываем info-text блок
    const infoText = this.infoBlock.nativeElement.querySelector('.info-text');
    if (infoText) {
      infoText.classList.add('animate-in');
    }
    
    // Затем запускаем анимацию слов
    const words = this.infoBlock.nativeElement.querySelectorAll('.word');
    words.forEach((word: HTMLElement) => {
      word.classList.add('animate');
    });
  }



  onMouseMove(event: MouseEvent) {
    this.mouseGradientService.onMouseMove(event);
    
    const element = event.currentTarget as HTMLElement;
    if (element.classList.contains('principle')) {
      this.apply3DEffect(element, event);
    }
  }

  onMouseLeave(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    this.mouseGradientService.resetGradientPosition(element);
    
    if (element.classList.contains('principle')) {
      this.reset3DEffect(element);
    }
  }
  
  private apply3DEffect(element: HTMLElement, event: MouseEvent) {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    this.animationFrameId = requestAnimationFrame(() => {
      element.style.transition = 'none';
      
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      const normalizedX = (x / rect.width) * 2 - 1;
      const normalizedY = (y / rect.height) * 2 - 1;
      
      const maxTilt = 12;
      const rotateY = -normalizedX * maxTilt;
      const rotateX = normalizedY * maxTilt;
      
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      element.style.boxShadow = `${normalizedX * 15}px ${normalizedY * 15 + 10}px 30px rgba(0, 0, 0, 0.2)`;
    });
  }
  
  private reset3DEffect(element: HTMLElement) {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    element.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
    element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    element.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
    
    setTimeout(() => {
      element.style.transition = 'none';
    }, 300);
  }

  onButtonMouseEnter() {
    this.isButtonHovered = true;
  }

  onButtonMouseLeave() {
    this.isButtonHovered = false;
  }

  reloadPage() {
    window.location.reload();
  }

  onCommunityMouseEnter() {
    this.isNavExpanded = true;
    this.isEcosystemExpanded = false;
  }

  onEcosystemMouseEnter() {
    this.isEcosystemExpanded = true;
    this.isNavExpanded = false;
  }

  onCommunityMouseLeave() {
  }

  onNavMouseLeave(event: MouseEvent) {
    this.mouseGradientService.resetGradientPosition(event.currentTarget as HTMLElement);
    this.isNavExpanded = false;
    this.isEcosystemExpanded = false;
  }

  onOtherNavItemEnter() {
    this.isNavExpanded = false;
    this.isEcosystemExpanded = false;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  scrollToDevbridge() {
    const element = document.getElementById('devbridge-block');
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  ngOnDestroy() {
    delete (window as any).setStarAnimation;
    delete (window as any).getStarAnimation;
    delete (window as any).regenerateNebulas;
    
    // Очищаем анимации
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.scrollAnimationId) {
      cancelAnimationFrame(this.scrollAnimationId);
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }

      @HostListener('mousemove', ['$event'])
    onMouseMoveGlobal(event: MouseEvent) {
      this.starAnimationService.onMouseMove(event);
      this.handleNebulaParallax(event);
    }
    
    private handleNebulaParallax(event: MouseEvent) {
      const nebulasContainer = document.querySelector('.nebulas-container') as HTMLElement;
      if (nebulasContainer) {
        const rect = window;
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;
        
        // Параллакс эффект для туманностей
        const translateX = x * 20; // Максимальное смещение 20px
        const translateY = y * 20;
        
        nebulasContainer.style.transform = `translate(${translateX}px, ${translateY}px)`;
        nebulasContainer.classList.add('mouse-active');
      }
    }
    
    private setupScrollEffects() {
      let ticking = false;
      
      const handleScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            this.updateScrollEffects();
            ticking = false;
          });
          ticking = true;
        }
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    private updateScrollEffects() {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - this.lastScrollY;
      
      // Вычисляем скорость скролла
      this.scrollVelocity = Math.abs(scrollDelta);
      this.scrollDirection = scrollDelta > 0 ? 1 : -1;
      
      // Максимальная скорость для нормализации
      const maxVelocity = 30;
      const normalizedVelocity = Math.min(this.scrollVelocity / maxVelocity, 1);
      
      // Устанавливаем флаг скроллинга
      this.isScrolling = true;
      
      // Применяем эффекты к cosmic-background
      this.applyScrollEffects(normalizedVelocity);
      
      // Очищаем предыдущий таймаут
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      
      // Устанавливаем таймаут для затухания эффектов
      this.scrollTimeout = setTimeout(() => {
        this.isScrolling = false;
        this.fadeOutScrollEffects();
      }, 100);
      
      this.lastScrollY = currentScrollY;
    }
    
    private applyScrollEffects(velocity: number) {
      const cosmicBackground = document.querySelector('.cosmic-background') as HTMLElement;
      if (!cosmicBackground) return;
      
      // Эффект ультраскорости - при скролле вниз фон летит вверх (к тебе)
      const moveIntensity = 40; // Сильнее движение
      const moveOffset = -this.scrollDirection * velocity * moveIntensity; // Инвертируем направление
      
      // Минимальное масштабирование
      const scaleIntensity = 0.04; // Еще меньше масштабирование
      const scaleOffset = Math.min(velocity * scaleIntensity, 0.02);
      const scale = 1 - scaleOffset;
      
      // Минимальный motion blur
      const blurIntensity = 4; // Уменьшаем blur
      const blurAmount = velocity * blurIntensity;
      
      // Применяем трансформации только во время скролла
      const transform = `translateY(${moveOffset}px) scale(${scale})`;
      const filter = blurAmount > 0.15 ? `blur(${blurAmount}px)` : 'blur(0px)';
      
      cosmicBackground.style.transform = transform;
      cosmicBackground.style.filter = filter;
    }
    
    private fadeOutScrollEffects() {
      const cosmicBackground = document.querySelector('.cosmic-background') as HTMLElement;
      if (!cosmicBackground) return;
      
      // Полностью возвращаем в исходное состояние
      const transform = `translateY(0px) scale(1)`;
      const filter = 'blur(0px)';
      
      cosmicBackground.style.transform = transform;
      cosmicBackground.style.filter = filter;
    }

  trackByStar(index: number, star: Star): number {
    return star.id;
  }

  trackByNebula(index: number, nebula: Nebula): number {
    return nebula.id;
  }
} 