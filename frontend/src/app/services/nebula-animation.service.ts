import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Nebula {
  id: number;
  initialX: number;
  initialY: number;
  width: number;
  height: number;
  shape: 'ellipse' | 'circle';
  ellipseX: number;
  ellipseY: number;
  opacity: number;
  animationClass: string;
}

@Injectable({
  providedIn: 'root'
})
export class NebulaAnimationService {
  private nebulasSubject = new BehaviorSubject<Nebula[]>([]);
  public nebulas = this.nebulasSubject.asObservable();

  initializeNebulas() {
    const nebulas: Nebula[] = [];
    
    // Генерируем 2 случайные туманности
    for (let i = 0; i < 2; i++) {
      nebulas.push(this.generateNebula(i));
    }
    
    this.nebulasSubject.next(nebulas);
  }

  private generateNebula(id: number): Nebula {
    // Первая туманность (id = 0) - слева вверху, вторая (id = 1) - справа вверху
    const initialX = id === 0 ? -5 : 85; // -5% слева (за экраном), 85% справа (за экраном)
    const initialY = id === 0 ? 10 : 50; // 10% сверху для левого, 30% для правого
    const animationClass = id === 0 ? 'nebula-left' : 'nebula-right';
    
    return {
      id,
      initialX,
      initialY,
      width: 600, // базовый размер
      height: 600, // базовый размер
      shape: 'circle', // всегда круг
      ellipseX: 50, // не используется для кругов
      ellipseY: 50, // не используется для кругов
      opacity: 0.6, // нормальная прозрачность
      animationClass
    };
  }

  regenerateNebulas() {
    this.initializeNebulas();
  }

  trackByNebula(index: number, nebula: Nebula): number {
    return nebula.id;
  }
} 