import { Component, OnInit, OnDestroy, inject, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MouseGradientService } from '../services/mouse-gradient.service';
import { StarAnimationService, Star } from '../services/star-animation.service';
import { LiquidGlassService } from '../services/liquid-glass.service';

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

    trigger('blockSlideUp', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(120px) scale(0.85) rotateX(15deg)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0) scale(1) rotateX(0deg)'
      })),
      transition('hidden => visible', [
        animate('1.2s cubic-bezier(0.16, 1, 0.3, 1)')
      ])
    ]),
    trigger('blockSlideFromLeft', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateX(-120px) rotateY(-15deg) scale(0.8)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateX(0) rotateY(0deg) scale(1)'
      })),
      transition('hidden => visible', [
        animate('1.2s cubic-bezier(0.16, 1, 0.3, 1)')
      ])
    ]),
    trigger('blockScaleUp', [
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0.6) translateY(80px) rotateZ(-3deg)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'scale(1) translateY(0) rotateZ(0deg)'
      })),
      transition('hidden => visible', [
        animate('1.3s cubic-bezier(0.16, 1, 0.3, 1)')
      ])
    ]),
    trigger('blockPerspective', [
      state('hidden', style({
        opacity: 0,
        transform: 'perspective(1200px) rotateX(25deg) rotateY(10deg) translateY(100px) scale(0.7)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)'
      })),
      transition('hidden => visible', [
        animate('1.4s cubic-bezier(0.16, 1, 0.3, 1)')
      ])
    ]),
    trigger('blockFadeUp', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(60px) scale(0.9)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0) scale(1)'
      })),
      transition('hidden => visible', [
        animate('1.0s cubic-bezier(0.16, 1, 0.3, 1)')
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
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateY(0)',
        opacity: 1
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
  stars$: Observable<Star[]>;
  
  isButtonHovered = false;
  navAnimationState = 'hidden';
  headerAnimationState = 'hidden';
  titleAnimationState = 'hidden';
  subtitleAnimationState = 'hidden';
  infoTextAnimated = false;

  howBlockState = 'hidden';
  architectureBlockState = 'hidden';
  buildBlockState = 'hidden';
  devbridgeBlockState = 'hidden';
  infoBlockState = 'hidden';
  
  @ViewChild('infoBlock', { static: false }) infoBlock!: ElementRef;
  @ViewChild('changingWord', { static: false }) changingWord!: ElementRef;
  
  private animationFrameId: number | null = null;
  private wordChangeInterval: any = null;
  private currentWordIndex = 0;
  private words = ['Secure', 'Transparent', 'Modular', 'Scalable', 'Fast'];
  
  // Glitch animation properties
  private possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:"<>?|';
  private glitchChars = '!@#$%^&*()_+{}:"<>?|\\';
  private cyberChars = '01010101110010101010101110101010';
  private animationFrames = 25;
  private animationSpeed = 30;
  private animationTimeouts: { [key: string]: number } = {};
  private isSafari: boolean = false;

  isNavExpanded = false;
  isEcosystemExpanded = false;
  
  isMobileMenuOpen = false;
  
  // Glass indicator для nav
  activeNavIndex = 3; // По умолчанию на Launch App
  defaultNavIndex = 3;
  previousNavIndex = 3;
  

  

  constructor(
    private mouseGradientService: MouseGradientService,
    private liquidGlassService: LiquidGlassService
  ) {
    this.stars$ = this.starAnimationService.stars;
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
    
    // Liquid glass работает автоматически через глобальный слушатель для всех элементов с миксином
    
    // Инициализируем позицию glass индикатора
    setTimeout(() => {
      this.updateNavGlassPosition();
    }, 1000);
    
    // Проверяем Safari для glitch анимации
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    
    (window as any).setStarAnimation = (mode: 'high' | 'medium' | 'low' | 'disabled') => {
      this.starAnimationService.setPerformanceMode(mode);
    };
    
    (window as any).getStarAnimation = () => {
      return this.starAnimationService.getPerformanceMode();
    };
    

    
          this.setupScrollAnimations();
    this.startWordChangeAnimation();
    }
  
  private startWordChangeAnimation() {
    setTimeout(() => {
      this.wordChangeInterval = setInterval(() => {
        this.changeWord();
      }, 3000); // Увеличил интервал для glitch анимации
    }, 3000);
  }
  
  private changeWord() {
    if (!this.changingWord) return;
    
    const element = this.changingWord.nativeElement;
    this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
    const newWord = this.words[this.currentWordIndex];
    
    // Запускаем glitch-анимацию
    this.animateText(element, newWord);
  }
  
  private animateText(element: HTMLElement, finalText: string): void {
    const elementId = 'changing-word';
    
    if (this.animationTimeouts[elementId]) {
      clearTimeout(this.animationTimeouts[elementId]);
    }

    if (this.isSafari) {
      // Для Safari просто меняем текст без анимации
      element.textContent = finalText;
      return;
    }

    let frame = 0;
    const totalFrames = this.animationFrames;

    const glitchStates = Array(finalText.length).fill(false);
    const resolvedChars = Array(finalText.length).fill(false);

    const animate = () => {
      if (frame >= totalFrames) {
        element.textContent = finalText;
        delete this.animationTimeouts[elementId];
        return;
      }

      let result = '';
      const progress = frame / totalFrames;

      // "Разрешаем" символы по очереди с задержкой
      // Начинаем разрешать буквы с 20% анимации, заканчиваем к 90%
      const startResolveFrame = Math.floor(totalFrames * 0.2);
      const endResolveFrame = Math.floor(totalFrames * 0.9);
      const resolveFrames = endResolveFrame - startResolveFrame;
      
      for (let i = 0; i < finalText.length; i++) {
        // Равномерно распределяем буквы по времени
        const letterStartFrame = startResolveFrame + Math.floor((resolveFrames * i) / (finalText.length - 1));
        if (frame >= letterStartFrame && !resolvedChars[i]) {
          resolvedChars[i] = true;
        }
      }

      // Случайные глитч-состояния
      if (frame % 3 === 0) {
        for (let i = 0; i < finalText.length; i++) {
          if (Math.random() < 0.15) {
            glitchStates[i] = !glitchStates[i];
          }
        }
      }

      // Формируем результирующий текст
      for (let i = 0; i < finalText.length; i++) {
        if (resolvedChars[i]) {
          // Символ "разрешен" - показываем правильную букву
          result += finalText[i];
        } else {
          // Символ еще не "разрешен"
          if (finalText[i] === ' ') {
            result += ' ';
          } else {
            const rand = Math.random();
            if (rand < 0.25) {
              const glitchIndex = Math.floor(Math.random() * this.glitchChars.length);
              result += this.glitchChars[glitchIndex];
            } else if (rand < 0.5) {
              const cyberIndex = Math.floor(Math.random() * this.cyberChars.length);
              result += this.cyberChars[cyberIndex];
            } else {
              const randomIndex = Math.floor(Math.random() * this.possibleChars.length);
              result += this.possibleChars[randomIndex];
            }
          }
        }
      }

      element.textContent = result;
      frame++;

      this.animationTimeouts[elementId] = window.setTimeout(animate, this.animationSpeed);
    };

    animate();
  }
  
  private setupScrollAnimations() {
    const blockObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const target = entry.target as HTMLElement;
        
        if (entry.isIntersecting) {
          if (target.classList.contains('how-block') && this.howBlockState === 'hidden') {
            this.howBlockState = 'visible';
          } else if (target.classList.contains('architecture-block') && this.architectureBlockState === 'hidden') {
            this.architectureBlockState = 'visible';
          } else if (target.classList.contains('build-block') && this.buildBlockState === 'hidden') {
            this.buildBlockState = 'visible';
          } else if (target.classList.contains('devbridge-block') && this.devbridgeBlockState === 'hidden') {
            this.devbridgeBlockState = 'visible';
            
            const cards = target.querySelectorAll('.card');
            cards.forEach((card, index) => {
              setTimeout(() => {
                (card as HTMLElement).classList.add('card-animate-in');
              }, index * 150);
            });
          }
        }
      });
    }, {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    });

    const infoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.infoTextAnimated) {
          this.infoBlockState = 'visible';
          setTimeout(() => this.startInfoTextAnimation(), 300);
        }
      });
    }, {
      threshold: 0.3
    });
    

    setTimeout(() => {
      const allBlocks = ['.how-block', '.architecture-block', '.build-block', '.devbridge-block'];
      const infoBlock = document.querySelector('.info-block');
      
      allBlocks.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          blockObserver.observe(element);
        }
      });
      
      if (infoBlock) {
        infoObserver.observe(infoBlock);
      }
    }, 100);
  }
  
  private startInfoTextAnimation() {
    this.infoTextAnimated = true;
    
    const infoText = this.infoBlock.nativeElement.querySelector('.info-text');
    if (infoText) {
      infoText.classList.add('animate-in');
    }
    
    const words = this.infoBlock.nativeElement.querySelectorAll('.word');
    words.forEach((word: HTMLElement) => {
      word.classList.add('animate');
    });
  }



  onMouseMove(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    if (element) {
      this.liquidGlassService.updateElementLighting(element, event.clientX, event.clientY);
    }
  }

  onMouseLeave(event: MouseEvent) {
    // Эффект автоматически исчезнет когда мышь уйдет
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
    this.isNavExpanded = false;
    this.isEcosystemExpanded = false;
    
    // Возвращаем стекло к Launch App при полном выходе из .nav
    this.previousNavIndex = this.activeNavIndex;
    this.activeNavIndex = this.defaultNavIndex;
    this.updateNavGlassPosition();
  }

  onOtherNavItemEnter() {
    this.isNavExpanded = false;
    this.isEcosystemExpanded = false;
  }

  onNavItemHover(index: number) {
    this.previousNavIndex = this.activeNavIndex;
    this.activeNavIndex = index;
    this.updateNavGlassPosition();
  }

  onNavMouseLeaveItem() {
    // НЕ возвращаемся сразу - ждем выхода из всего .nav контейнера
    // Логика возврата будет в onNavMouseLeave
  }

  private updateNavGlassPosition() {
    const indicator = document.querySelector('.nav-glass-indicator') as HTMLElement;
    const navItems = document.querySelectorAll('.nav-item');
    
    if (indicator && navItems.length > this.activeNavIndex) {
      const activeItem = navItems[this.activeNavIndex] as HTMLElement;
      const container = document.querySelector('.nav-content') as HTMLElement;
      
      if (activeItem && container) {
        // Вычисляем реальную позицию элемента относительно контейнера
        const itemRect = activeItem.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const relativeX = itemRect.left - containerRect.left;
        
        // Определяем направление движения
        const isMovingRight = this.activeNavIndex > this.previousNavIndex;
        const isMovingLeft = this.activeNavIndex < this.previousNavIndex;
        
        // Устанавливаем transform-origin в зависимости от направления
        if (isMovingRight) {
          indicator.style.transformOrigin = 'left center';
        } else if (isMovingLeft) {
          indicator.style.transformOrigin = 'right center';
        } else {
          indicator.style.transformOrigin = 'center center';
        }
        
        // Устанавливаем размеры и позицию
        indicator.style.width = `${itemRect.width}px`;
        indicator.style.height = `${itemRect.height}px`;
        indicator.style.transform = `translateX(${relativeX}px)`;
        
        // Выбираем анимацию в зависимости от направления
        let animationName = 'navGlassScale';
        if (isMovingRight) {
          animationName = 'navGlassScaleRight';
        } else if (isMovingLeft) {
          animationName = 'navGlassScaleLeft';
        }
        
        indicator.style.animation = `${animationName} 440ms cubic-bezier(0.23, 1, 0.32, 1)`;
        
        // Убираем анимацию после завершения
        setTimeout(() => {
          indicator.style.animation = '';
          indicator.style.transformOrigin = 'center center';
        }, 440);
      }
    }
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

    // Очищаем liquid glass сервис
    this.liquidGlassService.destroy();
    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    if (this.wordChangeInterval) {
      clearInterval(this.wordChangeInterval);
    }
    
    // Очищаем glitch анимационные таймауты
    Object.values(this.animationTimeouts).forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
  }

      @HostListener('mousemove', ['$event'])
    onMouseMoveGlobal(event: MouseEvent) {
      this.starAnimationService.onMouseMove(event);
    }
    


  trackByStar(index: number, star: Star): number {
    return star.id;
  }

  // Методы liquid glass теперь не нужны - всё обрабатывается сервисом
  onLiquidGlassMouseMove(event: MouseEvent) {
    // Логика теперь в LiquidGlassService
  }

  onLiquidGlassMouseLeave() {
    // Логика теперь в LiquidGlassService
  }

} 