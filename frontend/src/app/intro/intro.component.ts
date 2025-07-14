import { Component, OnInit, OnDestroy, inject, HostListener } from '@angular/core';
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
        paddingRight: '280px'
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

  isNavExpanded = false;
  isEcosystemExpanded = false;
  
  // Текст для анимации


  constructor(
    private mouseGradientService: MouseGradientService
  ) {
    this.stars$ = this.starAnimationService.stars;
    this.nebulas$ = this.nebulaAnimationService.nebulas;
  }

  ngOnInit() {
    // Запускаем анимацию хедера с небольшой задержкой
    setTimeout(() => {
      this.headerAnimationState = 'visible';
    }, 400);
    
    // Запускаем анимацию заголовка
    setTimeout(() => {
      this.titleAnimationState = 'visible';
    }, 1200);
    
    // Запускаем анимацию подзаголовка
    setTimeout(() => {
      this.subtitleAnimationState = 'visible';
    }, 2800);
    
    // Запускаем анимацию навигации с задержкой для более драматического эффекта
    setTimeout(() => {
      this.navAnimationState = 'visible';
    }, 800);
    
    // Инициализация звездной анимации
    this.starAnimationService.initializeStars();
    
    // Инициализация туманностей
    this.nebulaAnimationService.initializeNebulas();
    
    // Опционально - глобальные методы для управления анимацией:
    (window as any).setStarAnimation = (mode: 'high' | 'medium' | 'low' | 'disabled') => {
      this.starAnimationService.setPerformanceMode(mode);
    };
    
    (window as any).getStarAnimation = () => {
      return this.starAnimationService.getPerformanceMode();
    };
    
    (window as any).regenerateNebulas = () => {
      this.nebulaAnimationService.regenerateNebulas();
    };
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
    // Убираем этот метод - будем управлять через nav
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

  ngOnDestroy() {
    delete (window as any).setStarAnimation;
    delete (window as any).getStarAnimation;
    delete (window as any).regenerateNebulas;
  }

  // Методы для обработки движения мыши:
  @HostListener('mousemove', ['$event'])
  onMouseMoveGlobal(event: MouseEvent) {
    this.starAnimationService.onMouseMove(event);
  }

  trackByStar(index: number, star: Star): number {
    return star.id;
  }

  trackByNebula(index: number, nebula: Nebula): number {
    return nebula.id;
  }
} 