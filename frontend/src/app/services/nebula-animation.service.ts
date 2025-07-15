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

    for (let i = 0; i < 2; i++) {
      nebulas.push(this.generateNebula(i));
    }
    
    this.nebulasSubject.next(nebulas);
  }

  private generateNebula(id: number): Nebula {
    const initialX = id === 0 ? -5 : 85;
    const initialY = id === 0 ? 10 : 50;
    const animationClass = id === 0 ? 'nebula-left' : 'nebula-right';
    
    return {
      id,
      initialX,
      initialY,
      width: 40, // 40rem вместо 600px
      height: 40, // 40rem вместо 600px
      shape: 'circle',
      ellipseX: 50, 
      ellipseY: 50, 
      opacity: 0.6, 
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