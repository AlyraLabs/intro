import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MouseGradientService {

  constructor() { }

  /**
   * Обработчик движения мыши для создания градиентного эффекта
   * @param event - MouseEvent
   * @param element - HTML элемент (опционально, если не передан, используется currentTarget)
   */
  onMouseMove(event: MouseEvent, element?: HTMLElement): void {
    const targetElement = element || (event.currentTarget as HTMLElement);
    
    if (!targetElement) {
      return;
    }

    const rect = targetElement.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    targetElement.style.setProperty('--gradient-x', `${x}%`);
    targetElement.style.setProperty('--gradient-y', `${y}%`);
  }

  /**
   * Привязывает обработчик движения мыши к элементу
   * @param element - HTML элемент
   * @returns функция для отписки от события
   */
  attachMouseMoveListener(element: HTMLElement): () => void {
    const handler = (event: MouseEvent) => this.onMouseMove(event, element);
    element.addEventListener('mousemove', handler);
    
    // Возвращаем функцию для отписки от события
    return () => {
      element.removeEventListener('mousemove', handler);
    };
  }

  /**
   * Сбрасывает позицию градиента в центр
   * @param element - HTML элемент
   */
  resetGradientPosition(element: HTMLElement): void {
    element.style.setProperty('--gradient-x', '50%');
    element.style.setProperty('--gradient-y', '50%');
  }
} 