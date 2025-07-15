import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Star {
  id: number;
  initialX: number;
  initialY: number;
  offsetX1: string;
  offsetY1: string;
  offsetX2: string;
  offsetY2: string;
  offsetX3: string;
  offsetY3: string;
  duration: string;
  delay: string;
  appearDelay: string;
  opacity: number;
  weight: number;
}

@Injectable({
  providedIn: 'root'
})
export class StarAnimationService {
  private stars$ = new BehaviorSubject<Star[]>([]);
  private performanceMode: 'high' | 'medium' | 'low' | 'disabled' = 'high';
  private animationEnabled: boolean = true;
  private pushX: number = 0;
  private pushY: number = 0;
  private lastMouseX: number = 0;
  private lastMouseY: number = 0;
  private lastMoveTime: number = 0;
  private decayTimer: any;

  constructor(private ngZone: NgZone) {
    this.setupEventListeners();
  }

  get stars() {
    return this.stars$.asObservable();
  }

  initializeStars() {
    this.updateStarsCount();
  }

  setPerformanceMode(mode: 'high' | 'medium' | 'low' | 'disabled') {
    this.performanceMode = mode;
    this.animationEnabled = mode !== 'disabled';
    localStorage.setItem('star-animation-mode', mode);
    
    if (!this.animationEnabled) {
      this.stars$.next([]);
    } else {
      this.updateStarsCount();
    }
    

  }

  getPerformanceMode() {
    return this.performanceMode;
  }

  onMouseMove(event: MouseEvent) {
    if (!this.animationEnabled) {
      return;
    }

    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastMoveTime;
    
    if (deltaTime > 0 && this.lastMoveTime > 0) {
      const deltaX = event.clientX - this.lastMouseX;
      const deltaY = event.clientY - this.lastMouseY;
      
      const velocityX = deltaX / deltaTime * 8;
      const velocityY = deltaY / deltaTime * 8;
      
      const maxPush = 5;
      const newPushX = Math.max(-maxPush, Math.min(maxPush, velocityX));
      const newPushY = Math.max(-maxPush, Math.min(maxPush, velocityY));
      
      this.pushX += newPushX * 0.3;
      this.pushY += newPushY * 0.3;
      
      this.updatePushEffect();
    }
    
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
    this.lastMoveTime = currentTime;
  }

  private updatePushEffect() {
    const starsContainer = document.querySelector('.stars-container') as HTMLElement;
    if (starsContainer) {
      starsContainer.style.setProperty('--push-x', `${this.pushX}px`);
      starsContainer.style.setProperty('--push-y', `${this.pushY}px`);
    }
  }

  private startDecay() {
    if (this.decayTimer) {
      clearTimeout(this.decayTimer);
    }
    
    this.decayTimer = setTimeout(() => {
      this.decayPushEffect();
    }, 500);
  }

  private decayPushEffect() {
    const decayStep = () => {
      this.pushX *= 0.95;
      this.pushY *= 0.95;
      
      if (Math.abs(this.pushX) < 0.01 && Math.abs(this.pushY) < 0.01) {
        this.pushX = 0;
        this.pushY = 0;
        this.updatePushEffect();
        return;
      }
      
      this.updatePushEffect();
      requestAnimationFrame(decayStep);
    };
    
    decayStep();
  }

  private setupEventListeners() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private onResize() {
    this.updateStarsCount();
  }

  private updateStarsCount() {
    this.detectPerformanceMode();
    
    const width = window.innerWidth;
    let baseCount = Math.floor(width / 15);
    
    if (!this.animationEnabled) {
      const starsCount = 0;
      if (this.stars$.value.length !== starsCount) {
        this.generateStars(starsCount);
      }
      return;
    }

    switch (this.performanceMode) {
      case 'low':
        baseCount = Math.floor(baseCount * 0.2);
        break;
      case 'medium':
        baseCount = Math.floor(baseCount * 0.4);
        break;
      case 'high':
        baseCount = Math.floor(baseCount * 0.7);
        break;
    }
    
    const starsCount = Math.min(50, Math.max(5, baseCount));
    
    if (this.stars$.value.length !== starsCount) {
      this.generateStars(starsCount);
    }
  }

  private detectPerformanceMode() {
    const savedMode = localStorage.getItem('star-animation-mode');
    if (savedMode && ['high', 'medium', 'low', 'disabled'].includes(savedMode)) {
      this.performanceMode = savedMode as 'high' | 'medium' | 'low' | 'disabled';
      this.animationEnabled = savedMode !== 'disabled';
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;
    const pixelCount = width * height;
    
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const hasHardwareAcceleration = !!gl;
    
    if (pixelCount > 2073600 && hasHardwareAcceleration) {
      this.performanceMode = 'medium';
    } else if (pixelCount > 921600 || hasHardwareAcceleration) {
      this.performanceMode = 'low';
    } else {
      this.performanceMode = 'disabled';
    }
    
    this.animationEnabled = this.performanceMode !== 'disabled';
  }

  private generateStars(count: number) {
    const newStars: Star[] = [];
    
    for (let i = 0; i < count; i++) {
      const initialX = Math.random() * 100;
      const initialY = Math.random() * 100;
      const opacity = 0.3 + Math.random() * 0.7;
      const duration = 60 + Math.random() * 80;
      const delay = 0;

      const offsetX1 = Math.random() * 400 - 200;
      const offsetY1 = Math.random() * 400 - 200;
      const offsetX2 = Math.random() * 400 - 200;
      const offsetY2 = Math.random() * 400 - 200;
      const offsetX3 = Math.random() * 400 - 200;
      const offsetY3 = Math.random() * 400 - 200;
      const weight = 0.3 + Math.random() * 0.7;
      const appearDelay = Math.random() * 3; // Рандомная задержка от 0 до 3 секунд
      
      newStars.push({
        id: i,
        initialX,
        initialY,
        offsetX1: `${offsetX1}px`,
        offsetY1: `${offsetY1}px`,
        offsetX2: `${offsetX2}px`,
        offsetY2: `${offsetY2}px`,
        offsetX3: `${offsetX3}px`,
        offsetY3: `${offsetY3}px`,
        duration: `${duration}s`,
        delay: `${delay}s`,
        appearDelay: `${appearDelay}s`,
        opacity,
        weight
      });
    }

    this.stars$.next(newStars);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.onResize.bind(this));
    if (this.decayTimer) {
      clearTimeout(this.decayTimer);
    }
    this.stars$.complete();
  }
} 