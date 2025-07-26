import { Component, OnInit, OnDestroy, inject, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MouseGradientService } from '../services/mouse-gradient.service';
import { StarAnimationService, Star } from '../services/star-animation.service';

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
  stars$: Observable<Star[]>;
  
  isButtonHovered = false;
  navAnimationState = 'hidden';
  headerAnimationState = 'hidden';
  titleAnimationState = 'hidden';
  subtitleAnimationState = 'hidden';
  infoTextAnimated = false;
  
  @ViewChild('infoBlock', { static: false }) infoBlock!: ElementRef;
  @ViewChild('changingWord', { static: false }) changingWord!: ElementRef;
  
  private animationFrameId: number | null = null;
  private wordChangeInterval: any = null;
  private currentWordIndex = 0;
  private words = ['Secure', 'Transparent', 'Modular', 'Scalable', 'Fast'];

  isNavExpanded = false;
  isEcosystemExpanded = false;
  
  isMobileMenuOpen = false;
  

  

  constructor(
    private mouseGradientService: MouseGradientService
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
      }, 2500); 
    }, 3000);
  }
  
  private changeWord() {
    if (!this.changingWord) return;
    
    const element = this.changingWord.nativeElement;
    
    element.style.opacity = '0';
    element.style.transform = 'translateY(-20px) scale(0.8)';
    element.style.filter = 'blur(10px)';
    
    setTimeout(() => {
      this.currentWordIndex = (this.currentWordIndex + 1) % this.words.length;
      element.textContent = this.words[this.currentWordIndex];
      
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1)';
        element.style.filter = 'blur(0px)';
      }, 50);
    }, 400);
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
      const infoBlock = document.querySelector('.info-block');
      
      regularBlocks.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) {
          observer.observe(element);
        }
      });
      
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
  }

  onMouseLeave(event: MouseEvent) {
    const element = event.currentTarget as HTMLElement;
    this.mouseGradientService.resetGradientPosition(element);
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

    
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    
    if (this.wordChangeInterval) {
      clearInterval(this.wordChangeInterval);
    }
  }

      @HostListener('mousemove', ['$event'])
    onMouseMoveGlobal(event: MouseEvent) {
      this.starAnimationService.onMouseMove(event);
    }
    


  trackByStar(index: number, star: Star): number {
    return star.id;
  }


} 