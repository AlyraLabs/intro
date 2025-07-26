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