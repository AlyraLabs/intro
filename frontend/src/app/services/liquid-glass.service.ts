import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LiquidGlassService {

  constructor() {
    this.startGlobalListener();
  }

  private startGlobalListener() {
    document.addEventListener('mousemove', (event: MouseEvent) => {
      const liquidElements = document.querySelectorAll(`
        [data-liquid-glass],
        [ng-reflect-mouse-move],
        .liquid-glass
      `.trim());

      liquidElements.forEach(element => {
        this.updateElementLighting(element as HTMLElement, event.clientX, event.clientY);
      });
    });
  }

  updateElementLighting(element: HTMLElement, mouseX: number, mouseY: number) {
    const rect = element.getBoundingClientRect();
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    const directionX = distance > 0 ? deltaX / distance : 0;
    const directionY = distance > 0 ? deltaY / distance : 0;
    
    const maxDistance = 800;
    const lightMin = 0.8;
    const lightMax = 2.5;
    const darkMin = 0.3;
    const darkMax = 1.2;
    
    const normalizedDistance = Math.min(distance / maxDistance, 1);
    
    const lightIntensity = Math.max(lightMin, lightMax - normalizedDistance * (lightMax - lightMin));
    const darkIntensity = Math.max(darkMin, darkMax - normalizedDistance * (darkMax - darkMin));
    
    element.style.setProperty('--light-direction-x', directionX.toFixed(3));
    element.style.setProperty('--light-direction-y', directionY.toFixed(3));
    element.style.setProperty('--glass-reflex-light', lightIntensity.toFixed(2));
    element.style.setProperty('--glass-reflex-dark', darkIntensity.toFixed(2));
  }

  destroy() {
  }
} 